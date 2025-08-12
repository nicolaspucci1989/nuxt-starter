import { PrismaClient } from "@prisma/client";
import { ServerFile } from "nuxt-file-storage";
import fs from "fs-extra";
import path from "path";

interface Media {
  name: string;
  originalName: string;
  path: string;
  fullPath: string;
  type: string;
}

interface Contract {
  id?: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  media: (ServerFile & { isNew?: boolean })[];
  contractRoles: {
    role: "owner" | "tenant";
    userId: number;
  }[];
}

interface ContractUpdateDto extends Omit<Contract, "media"> {
  id: number;
  media?: (Media & { toDelete?: boolean } & ServerFile & { isNew?: boolean })[];
}

const prisma = new PrismaClient();

const ContractService = {
  async create(contract: Contract) {
    const { media, contractRoles, ...rest } = contract;

    const createdContract = await prisma.contract.create({
      data: {
        ...rest,
        contractRoles: {
          create: contractRoles.map((r) => ({
            userId: r.userId,
            role: r.role,
          })),
        },
      },
    });

    const basePath = `contracts/${createdContract.id}`;

    const storedFiles = [];
    for (const file of media) {
      if (file.isNew) {
        const result = await storeFileLocally(file, 8, basePath);
        storedFiles.push({
          name: result,
          originalName: file.name,
          path: `${basePath}/${result}`,
          fullPath: `${process.env.BASE_URL}/storage/${basePath}/${result}`,
          type: file.type,
        });
      } else {
        storedFiles.push(file);
      }
    }

    await prisma.contract.update({
      where: { id: createdContract.id },
      data: {
        media: JSON.stringify(storedFiles),
      },
    });
  },
  async update(contractId: number, contract: ContractUpdateDto) {
    const { media, contractRoles, ...rest } = contract;

    const prevContract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { contractRoles: true },
    });

    if (!prevContract) {
      throw new Error("Contract not found");
    }

    const basePath = `contracts/${contractId}`;
    const storedMedia: Media[] = [];
    await Promise.all(
      media?.map(async (m) => {
        if (m.toDelete) {
          await deleteFile(m.path);
        } else if (m.isNew) {
          const result = await storeFileLocally(m, 8, basePath);
          storedMedia.push({
            name: result,
            originalName: m.name,
            path: `${basePath}/${result}`,
            fullPath: `${process.env.BASE_URL}/storage/${basePath}/${result}`,
            type: m.type,
          });
        } else {
          storedMedia.push(m);
        }
      }) || []
    );

    const deleteContractRoles = [];
    for (const prevRole of prevContract.contractRoles) {
      if (
        !contractRoles?.find(
          (r) => r.userId == prevRole.userId && r.role == prevRole.role
        )
      ) {
        deleteContractRoles.push(prevRole.id);
      }
    }
    const createContractRoles = [];
    for (const role of contractRoles || []) {
      if (
        !prevContract.contractRoles.find(
          (r) => r.userId == role.userId && r.role == role.role
        )
      ) {
        createContractRoles.push({
          userId: role.userId,
          role: role.role,
        });
      }
    }

    await prisma.contract.update({
      where: { id: contractId },
      data: {
        ...rest,
        media: JSON.stringify(storedMedia),
        contractRoles: {
          createMany: { data: createContractRoles },
          deleteMany: { id: { in: deleteContractRoles } },
        },
      },
    });
  },
  async delete(contractId: number) {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });
    if (!contract) {
      throw new Error("Contract not found");
    }
    let p1;
    if (contract.media) {
      const media: Media[] = JSON.parse(contract.media);
      let dirPath = media[0]?.path.split("/").slice(0, -1).join("/");
      dirPath = path.join(process.env.FILE_STORAGE_MOUNT!, dirPath);
      p1 = fs.remove(dirPath)
    }
    const p2 = prisma.contract.delete({
      where: { id: contractId },
    });
    await Promise.all([p1, p2]);
  },
};

export default ContractService;
