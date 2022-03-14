const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const packageDefination = protoLoader.loadSync(
  __dirname + '/src/proto/message.proto'
)
const protoDescriptor = grpc.loadPackageDefinition(packageDefination)
const MessagePackage = protoDescriptor.MessagePackage

function main() {
  const client = new MessagePackage.MessageService(
    '127.0.0.1:50051',
    grpc.credentials.createInsecure()
  )

  client.sendMessage(
    {
      body: process.argv[2],
    },
    (err, response) => {
      if (err) {
        console.log(err)
        return
      }

      console.log('Server: ', response)
    }
  )

  client.readMessages({}, (err, response) => {
    if (err) {
      console.log(err)
      return
    }

    console.log('Server: ', response)
  })

  const messagesStream = client.readMessagesStream()
  messagesStream.on('data', (message) => {
    console.log('Server: ', message)
  })
  messagesStream.on('end', () => console.log('Messages stream ended.'))
}

main()
