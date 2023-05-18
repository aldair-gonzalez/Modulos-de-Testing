import { Command } from 'commander'

const program = new Command()

program
  .option('-p, --port <port>', 'Puerto de ejecución')
  .option('-m, --mode <mode>', 'Modo de desarrollo', 'DEVELOPMENT')
  .option('-s, --store <store>', 'Tipo de persistencia de datos', 'MONGO')
  .parse(process.argv)

const options = program.opts()
export const { port, mode, store } = options
