import * as tl from "azure-pipelines-task-lib/task";

export function resolveBranchName(sourceBranchName: string, pullRequestSourceBranch: string | undefined): string {
    let deploymentName = sourceBranchName.replace("refs/heads/", "");

    if (pullRequestSourceBranch != null) {
        const pullRequestSourceBranchName = pullRequestSourceBranch.replace("refs/heads/", "");

        if (pullRequestSourceBranchName != null) {
            deploymentName = pullRequestSourceBranchName;
        }
    }

    return deploymentName;
}

async function main(): Promise<void> {
    try {
        const SOURCE_BRANCH_NAME = tl.getVariable("Build.SourceBranch");
        const PULL_REQUEST_SOURCE_BRANCH = tl.getVariable("System.PullRequest.SourceBranch");
        const VARIABLE_NAME = tl.getInput("variableKey", true);

        console.info(`Setting variable: ${VARIABLE_NAME}:${resolveBranchName(SOURCE_BRANCH_NAME, PULL_REQUEST_SOURCE_BRANCH)}`);
        tl.setVariable(VARIABLE_NAME, resolveBranchName(SOURCE_BRANCH_NAME, PULL_REQUEST_SOURCE_BRANCH));
        console.info(tl.getVariables());
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

main();
