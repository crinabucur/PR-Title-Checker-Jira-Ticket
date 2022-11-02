# PR-Title-Checker-Jira-Ticket
A GitHub action which ensures that all Pull Requests start with a Jira ticket or a no-ticket indication

## Inputs

## `jira-project-key`

**Required** The Jira project key of the repository (i.e. `SYC`).

## `no-ticket-prefix`

The prefix allowed for Pull Requests without a Jira ticket (i.e. `NoTicket`)

## `ignore-case`

Perform a case insensitive check. Default `false`.

## `verbose`

Log the JSON webhook payload for the event that triggered the workflow. Default `false`.

## Example usage

```
uses: ./.github/actions/hello-world-javascript-action
with:
    jira-project-key: 'SYC'
    no-ticket-prefix: 'NoTicket'
    ignore-case: true
    verbose: true
```
