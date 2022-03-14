const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const packageDefination = protoLoader.loadSync(
  __dirname + '/proto/message.proto'
)
const protoDescriptor = grpc.loadPackageDefinition(packageDefination)
const MessagePackage = protoDescriptor.MessagePackage

const messages = []

const sendMessage = (call, callback) => {
  messages.push(call.request)
  callback(null, call.request)
}

const readMessages = (call, callback) => {
  callback(null, { messages })
}

const readMessagesStream = (call) => {
  messages.forEach((message) => call.write(message))
  call.end()
}

function main() {
  const server = new grpc.Server()

  server.addService(MessagePackage.MessageService.service, {
    sendMessage,
    readMessages,
    readMessagesStream,
  })

  server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.info('Server ready on localhost:50051')
      server.start()
    }
  )
}

main()
