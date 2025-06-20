export default defineTask({
  meta: {
    name: "echo",
    description: "A task to be executed",
  },
  run({ payload, context }) {
    console.log("Running echo task...");
    return { result: payload };
  },
});
