module.exports = async ({ github, context, core }) => {
  try {
    console.log(github, context, core);
    // console.log();
  } catch (err) {
    console.log("err : ", err);
  }
};
