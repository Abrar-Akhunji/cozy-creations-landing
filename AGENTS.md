# Codex Custom Instructions

## Graphify Integration

You have access to a Graphify knowledge graph at:
`"/Users/abrarakhunji/Desktop/Afiya dd/Afiya DD/Afiya DD/afiyafinalweb/graphify-out"`

For every question/task:
1. **Query the Graph First**: Run the query command to retrieve relevant architecture and context:
   ```bash
   graphify query "<user question or search terms>" --graph "/Users/abrarakhunji/Desktop/Afiya dd/Afiya DD/Afiya DD/afiyafinalweb/graphify-out/graph.json"
   ```
2. **Utilize Context**: Use the returned graph context to formulate your answer or planning.
3. **Lazy File Loading**: If and only if the graph context is insufficient, read specific files. Do NOT scan the entire codebase or load full files unless absolutely necessary.
4. **Prefer Graph Relationships**: Leverage relationships, dependencies, and paths from the graph. Cite source files mentioned in the graph output when possible.

## Automatic Update Rule
- **Mandatory Rebuild**: After making any changes or edits to files in this codebase, you MUST update the Graphify knowledge graph immediately by running:
  ```bash
  graphify update ./
  ```
  This keeps the graph synchronized and ensures future commands/agents have accurate context.
