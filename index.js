const core = require('@actions/core');
const github = require('@actions/github');
const { request } = require("@octokit/request");

function calculateNextTag(currentTag) {
  // @TODO what if someone pushes a bad tag manually in the repo? needs robustness
  const nextPatchVersion = parseInt(currentTag.split(".").reverse()[0]) + 1;
  const newTagSplit = currentTag.split(".").slice(0, 2);
  newTagSplit.push(`${nextPatchVersion}`);
  return newTagSplit.join(".");
}

async function getLatestTag(octokit, owner, repo) {
  try {
    const tagsRespone  = await octokit.repos.listTags({
      owner,
      repo,
    });
    const tags = tagsRespone.data || [];
    console.log('tags', tags);
    const latestTag = tags[0] || {};
    console.log('latestTag', latestTag);
    const nextTagName = calculateNextTag(latestTag.name || '0.0.0');
    console.log('nextTagName', nextTagName);
    core.setOutput('nextTagName', nextTagName);
  } catch (error) {
    console.log('error', error);
    core.setFailed(error.message);
  }
}

async function makeRelease(octokit, o, r, t, token) {
  // try {
  //   await octokit.repos.createRelease({
  //     owner,
  //     repo,
  //     tag_name,
  //   });
  // } catch (error) {
  //   console.log('error is', error);
  //   core.setFailed(error.message);
  // }
  const requestWithAuth = request.defaults({
    headers: {
      authorization: `Bearer ${token}`
    },
  });
  
  const owner = "ichalagashvili";
  const repo = "app-builder";
  const tag_name = "irakli tag";
  const body = 'released by gm';
  const draft = false;
  const prerelease = false;
  
  requestWithAuth("post /repos/{owner}/{repo}/releases", {
      token,
      owner,
      repo,
      tag_name,
      body,
      draft,
      prerelease,
  })
    .then(result => {
      console.log("result", result);
    })
    .catch(error => {
      console.log("error", error);
      core.setFailed(error.message);
    });
}

async function run() {
  try {
    const myToken = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit(myToken);
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
    const nextTagName = await getLatestTag(octokit, owner, repo);
    await makeRelease(octokit, owner, repo, nextTagName, myToken);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();