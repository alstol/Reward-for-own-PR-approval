const axios = require("axios");

const NEUTRAL_ERROR_CODE = process.env.GITHUB_WORKFLOW ? 78 : 0;
const githubActor = process.env.GITHUB_ACTOR || "";
const githubEventPath = process.env.GITHUB_EVENT_PATH || "";
const githubEvent = githubEventPath ? require(githubEventPath) : "";
const githubRepo = process.env.GITHUB_REPOSITORY || "";
const githubRepoUri = `https://api.github.com/repos/${githubRepo}`;
const githubPrCommentsUri = `${githubRepoUri}/issues/${githubEvent.number}/comments`;
const githubApiVersion = "v3";
const githubToken = process.env.GITHUB_TOKEN || "";
const githubAcceptHeader = `application/vnd.github.${githubApiVersion}+json; application/vnd.github.antiope-preview+json`;
const githubAuthHeader = `token ${githubToken}`;
const githubApiHeaders = {
  Accept: githubAcceptHeader,
  Authorization: githubAuthHeader
};
const imageUrl = process.env.IMAGE_URL || "https://i.imgur.com/EQdmJcS.jpg";
let memeHeader = process.env.MEME_HEADER || `When @${githubActor} merges their own Pull Request`;

/**
 * @return {Promise} Promise representing the HTTP POST of a comment.
 */
function postComment() {
  console.log("Posting image...");

  return axios.post(
    githubPrCommentsUri,
    { body: `# ${memeHeader} \n![pr_self_merge](${imageUrl})` },
    {
      headers: githubApiHeaders
    }
  );
}


if (
  !githubEvent ||
  (githubEvent.action !== "closed")
) {
  console.log(
    `GitHub event payload not found or Pull Request event does not have desired action. Action was ${githubEvent.action}.`
  );
  process.exit(NEUTRAL_ERROR_CODE);
}

postComment()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });

setTimeout(() => {
  console.log("Reached maximum timeout.");
  process.exit(1);
}, 300000);
