const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit()

function calculateNextTag(currentTag) {
  // @TODO what if someone pushes a bad tag manually in the repo? needs robustness
  return parseInt(currentTag.split(".").reverse()[0]) + 1;
}

async function getLatestTag() {
  try {
    const tagsRespone  = await octokit.repos.listTags({
      owner: 'ichalagashvili',
      repo: 'app-builder',
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

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  getLatestTag();
} catch (error) {
  core.setFailed(error.message);
}