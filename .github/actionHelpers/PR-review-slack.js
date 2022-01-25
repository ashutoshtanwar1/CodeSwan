module.exports = async ({ github, context }) => {
  try {
    const { label = {}, pull_request = {}, sender = {} } = context.payload;
    const {
      additions,
      changed_files,
      deletions,
      html_url: prUrl,
      title,
    } = pull_request;
    const { html_url: userUrl, login: userName } = sender;
    const isUrgent = (label.name || "").includes("Urgent");
    const msgToBeSend = `<${userUrl}|${userName}> requested PR Review ${
      isUrgent && "URGENTLY"
    }\n\n${title} - (+${additions} , -${deletions} , ${changed_files} files changed.)\n\n<${prUrl}|VIEW PR>`;

    console.log(context.issue, context.repo);

    console.log(
      msgToBeSend,
      "\n\nMERGED:",
      github.pulls.checkIfMerged({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
      })
    );

    github.issues.addAssignees({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      assignees: ["assignees"],
    });

    github.pulls.requestReviewers({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.issue.number,
      reviewers: ["reviewers"],
    });
  } catch (err) {
    console.log("err : ", err);
  }
};
