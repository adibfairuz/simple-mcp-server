const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
	StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const fs = require('node:fs/promises');

const server = new McpServer({
  name: 'demo-mcp',
  version: '1.0.0',
});

server.registerTool(
  'create-user',
  {
    title: 'Create User',
    description: 'Create user data',
    inputSchema: {
      name: z.string(),
      email: z.string().email(),
      address: z.string()
    }
  }, async ({ name, email, address }) => {
    const data = require('C:/Users/adib/Desktop/projects/demo-mcp/data.json');
    data.push({
      name,
      email,
      address
    });
    await fs.writeFile('C:/Users/adib/Desktop/projects/demo-mcp/data.json', JSON.stringify(data));

    return {
      content: [
        {
          type: 'text',
          text: `${name} is successfuly added to ${JSON.stringify(data)}`
        }
      ]
    }
});

server.registerResource(
  'user list',
  'users://list',
  {
    title: "user list",
    description: "List of users data in json format",
    mimeType: "application/json"
  },
  async (uri) => {
    const data = require('C:/Users/adib/Desktop/projects/demo-mcp/data.json');
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(data),
        mimeType: 'application/json'
      }]
    } 
  }
)

server.registerPrompt(
  "generate-fake-user",
  {
    title: "generate fake user",
    description: "generate a fake user based on a given name",
    argsSchema: {
      name: z.string()
    }
  },
  ({ name }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `generate fake user with the name ${name}. the user should have realistic email, and address`
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: "the result is json. this is the result of json schema { name, email, address }"
        }
      },
    ]
  })
)

async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error('Failed to start');
  }
}

startServer();
