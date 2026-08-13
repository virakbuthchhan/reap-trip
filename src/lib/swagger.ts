export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Reap Trip API Documentation',
    version: '1.0.0',
    description:
      'Interactive OpenAPI 3.0 specification for the Reap Trip adventure travel platform in Cambodia. Includes authentication, destinations, local guides, expenses, camp recipes, trip reports, and packing checklist.',
    contact: {
      name: 'Reap Trip Team',
      email: 'support@reaptrip.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'reap_trip_token',
        description: 'HTTP-Only JWT Cookie authentication',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    { name: 'Health', description: 'System health check' },
    { name: 'Authentication', description: 'User registration, login, profile, and logout' },
    { name: 'Destinations', description: 'Cambodian nature destinations & bookmarks' },
    { name: 'Local Guides', description: 'Community guides directory' },
    { name: 'Expenses', description: 'Group trip expense splitter & settlement debt calculations' },
    { name: 'Meals & Recipes', description: 'Camp cooking recipes' },
    { name: 'Trip Reports', description: 'Community adventure trip reports & updates' },
    { name: 'Packing Checklist', description: 'Camp packing checklist items' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API, Database, and Redis health status',
        responses: {
          200: {
            description: 'System is healthy',
            content: {
              'application/json': {
                example: {
                  status: 'ok',
                  timestamp: '2026-08-13T16:34:00.000Z',
                  services: { database: 'healthy', cache: 'healthy' },
                },
              },
            },
          },
          503: { description: 'System is degraded' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', example: 'adventurer@reaptrip.com' },
                  password: { type: 'string', example: 'password123' },
                  name: { type: 'string', example: 'Bopha Chan' },
                  role: { type: 'string', enum: ['traveller', 'tour_leader', 'local_guide', 'homestay_provider'], default: 'traveller' },
                  phone: { type: 'string', example: '+855 12 345 678' },
                  province: { type: 'string', example: 'Phnom Penh' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error or existing user' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate user with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'bopha.chan@reaptrip.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
          429: { description: 'Rate limit exceeded' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get currently authenticated user profile',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: 'Active user profile' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout user and clear authentication cookie',
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/api/destinations': {
      get: {
        tags: ['Destinations'],
        summary: 'Get list of Cambodian adventure destinations',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'mountain | waterfall | forest | campsite | lake' },
          { name: 'difficulty', in: 'query', schema: { type: 'string' }, description: 'easy | moderate | challenging | extreme' },
          { name: 'province', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of destinations' },
        },
      },
    },
    '/api/destinations/{id}': {
      get: {
        tags: ['Destinations'],
        summary: 'Get destination by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Destination detail' },
          404: { description: 'Destination not found' },
        },
      },
    },
    '/api/destinations/{id}/save': {
      post: {
        tags: ['Destinations'],
        summary: 'Toggle save/bookmark destination for current user',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Updated bookmark status' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/guides': {
      get: {
        tags: ['Local Guides'],
        summary: 'Get community local guides',
        parameters: [{ name: 'destinationId', in: 'query', schema: { type: 'string' } }],
        responses: {
          200: { description: 'List of local guides' },
        },
      },
    },
    '/api/expenses': {
      get: {
        tags: ['Expenses'],
        summary: 'Get all trip expense items',
        responses: { 200: { description: 'List of expenses' } },
      },
      post: {
        tags: ['Expenses'],
        summary: 'Create a new trip expense item',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'amount', 'paidByMemberId', 'splitAmongMemberIds', 'category', 'date'],
                properties: {
                  title: { type: 'string', example: 'Motorbike Fuel' },
                  amount: { type: 'number', example: 25.0 },
                  currency: { type: 'string', enum: ['USD', 'KHR'], default: 'USD' },
                  paidByMemberId: { type: 'string', example: 'user_traveller_1' },
                  splitAmongMemberIds: { type: 'array', items: { type: 'string' } },
                  category: { type: 'string', enum: ['fuel', 'guide_fee', 'food', 'camp_fee', 'transport_rental', 'other'] },
                  date: { type: 'string', example: '2026-02-01' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Expense created' } },
      },
      delete: {
        tags: ['Expenses'],
        summary: 'Delete trip expense item',
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Expense deleted' } },
      },
    },
    '/api/expenses/settle': {
      post: {
        tags: ['Expenses'],
        summary: 'Calculate optimal debt settlements among trip members',
        responses: {
          200: { description: 'Calculated settlements in USD and KHR' },
        },
      },
    },
    '/api/meals': {
      get: {
        tags: ['Meals & Recipes'],
        summary: 'Get camp recipes',
        responses: { 200: { description: 'List of recipes' } },
      },
      post: {
        tags: ['Meals & Recipes'],
        summary: 'Create a new camp recipe',
        responses: { 201: { description: 'Recipe created' } },
      },
    },
    '/api/experiences': {
      get: {
        tags: ['Trip Reports'],
        summary: 'Get trip reports & experience reviews',
        parameters: [{ name: 'destinationId', in: 'query', schema: { type: 'string' } }],
        responses: { 200: { description: 'List of trip reports' } },
      },
      post: {
        tags: ['Trip Reports'],
        summary: 'Create a new trip report',
        responses: { 201: { description: 'Trip report posted' } },
      },
    },
    '/api/experiences/{id}/comments': {
      post: {
        tags: ['Trip Reports'],
        summary: 'Add a comment to a trip report',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 201: { description: 'Comment added' } },
      },
    },
    '/api/checklist': {
      get: {
        tags: ['Packing Checklist'],
        summary: 'Get camp packing items',
        responses: { 200: { description: 'List of packing items' } },
      },
      patch: {
        tags: ['Packing Checklist'],
        summary: 'Toggle packed status of a packing item',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id', 'packed'],
                properties: {
                  id: { type: 'string' },
                  packed: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Updated item' } },
      },
    },
  },
};
