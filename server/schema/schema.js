//Mongoose Models
const Project = require('../models/Project');
const Client = require('../models/Client');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql');

// Client Type

const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});
// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    clientId: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

// Queries are how we get/fetch data from the server (read)

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        try {
          return Project.find();
        } catch (err) {
          console.log(err);
        }
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        try {
          return Project.findById(args.id);
        } catch (err) {
          console.log(err);
        }
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        try {
          return Client.find();
        } catch (err) {
          console.log(err);
        }
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        try {
          return Client.findById(args.id);
        } catch (err) {
          console.log(err);
        }
      },
    },
  },
});

// Mutations are how we modify data on the server (create, update, delete)
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add Client
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        try {
          let client = new Client({
            name: args.name,
            email: args.email,
            phone: args.phone,
          });
          return client.save();
        } catch (err) {
          console.log(err);
        }
      },
    },
    // Delete Client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        try {
          return Client.findByIdAndDelete(args.id);
        } catch (err) {
          console.log(err);
        }
      },
    },
    // Add Project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'Status',
            values: {
              NotStarted: { value: 'NotStarted' },
              InProgress: { value: 'InProgress' },
              Completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        try {
          let project = new Project({
            name: args.name,
            description: args.description,
            status: args.status,
            clientId: args.clientId,
          });
          return project.save();
        } catch (err) {
          console.log(err);
        }
      },
    },
    // Delete Project
    deleteProject: {
      type: ProjectType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },

      resolve(parent, args) {
        try {
          return Project.findByIdAndDelete(args.id);
        } catch (err) {
          console.log(err);
        }
      },
    },
    // Update Project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'StatusUpdate',
            values: {
              NotStarted: { value: 'NotStarted' },
              InProgress: { value: 'InProgress' },
              Completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve(parent, args) {
        try {
          return Project.findByIdAndUpdate(
            args.id,
            {
              name: args.name,
              description: args.description,
              status: args.status,
            },
            { new: true }
          );
        } catch (err) {
          console.log(err);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
