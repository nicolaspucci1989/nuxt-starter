import { PrismaClient } from "@prisma/client";
import { ServerFile } from "nuxt-file-storage";

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
  files: (ServerFile & { isNew?: boolean })[];
  contractRoles: {
    role: "owner" | "tenant";
    userId: number;
  }[];
}

interface ContractUpdateDto extends Omit<Contract, "files" | "contractRoles"> {
  id: number;
  media?: (Media & { toDelete?: boolean } & ServerFile & { isNew?: boolean })[];
  contractRoles?: {
    role: "owner" | "tenant";
    userId: number;
    toDelete?: boolean;
  }[];
}

const prisma = new PrismaClient();

const ContractService = {
  async create(contract: Contract) {
    const { files, contractRoles, ...rest } = contract;

    const createdContract = await prisma.contract.create({
      data: rest,
    });

    if (contractRoles?.length) {
      await Promise.all(
        contractRoles.map((contractRole) =>
          prisma.contractRole.create({
            data: {
              userId: contractRole.userId,
              contractId: createdContract.id,
              role: contractRole.role,
            },
          })
        )
      );
    }

    const basePath = `contracts/${createdContract.id}`;

    const storedFiles = [];
    for (const file of files) {
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

    const basePath = `contracts/${contract.id}`;
    const storedMedia: Media[] = [];
    const p1 = Promise.all(
      media?.map(async (m) => {
        if (m.toDelete) {
          await deleteFile(m.name, m.path);
        } else if (m.isNew) {
          const result = await storeFileLocally(m, `contracts/${contract.id}`);
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

    const p2 = Promise.all(
      contractRoles?.map(async (role) => {
        if (role.toDelete) {
          await prisma.contractRole.deleteMany({
            where: {
              contractId: contract.id,
              userId: role.userId,
              role: role.role,
            },
          });
        }
      }) || []
    );

    await Promise.all([p1, p2]);

    await prisma.contract.update({
      where: { id: contractId },
      data: {
        ...rest,
        media: JSON.stringify(storedMedia),
      },
    });
  },
};

export default ContractService;
