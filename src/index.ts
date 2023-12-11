import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE, TAccount } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

// getAccountById
app.get('/accounts/:id', (req: Request, res: Response) => {
	const idToFind = req.params.id 

	const result: TAccount = accounts.find((account) => {
        return account.id === idToFind
    })        

  res.status(200).send(result)
})

// createNewAccount
app.post("/accounts", (req: Request, res: Response) => {
	const id = req.body.id as string
	const ownerName = req.body.ownerName as string
	const balance = req.body.balance as number
	const type = req.body.type as ACCOUNT_TYPE

	const newAccount: TAccount = {
		id,
		ownerName,
		balance,
		type
	}

	accounts.push(newAccount)

  res.status(201).send("Conta cadastrada com sucesso!")
})

// deleteAccount
app.delete('/accounts/:id', (req: Request, res: Response) => {
		// identificação do que será deletado via path params
    const idToDelete = req.params.id

		// encontrar o index do item que será removido
    const accountIndex: number = accounts.findIndex((account) => {
        return account.id === idToDelete
    })

		// caso o item exista, o index será maior ou igual a 0
    if (accountIndex >= 0) {
				// remoção do item através de sua posição
        accounts.splice(accountIndex, 1)
    }

    // console.log(accounts);
    
    res.status(200).send("Item deletado com sucesso")
})

// editAccount
app.put('/accounts/:id', (req: Request, res: Response) => {
		// id que será atualizado chega via path params
    const idToEdit = req.params.id

	  // recebemos do body o que será atualizado
	  // todos os dados que podem ser atualizados são opcionais
	  // se precisarmos atualizar só o balance por exemplo,
		// não é necessário reenviar os outros (melhor experiência)
		// mas caso precisarmos atualizar mais de um, também é possível
		const newId = req.body.id as string | undefined         // cliente pode ou não enviar id
		const newOwnerName = req.body.ownerName as string | undefined     // cliente pode ou não enviar name
		const newBalance = req.body.balance as number | undefined       // cliente pode ou não enviar balance
		const newType = req.body.type as ACCOUNT_TYPE | undefined   // cliente pode ou não enviar type

    const account = accounts.find((account) => account.id === idToEdit)

		// pode ser que a account não exista com a id informada no path params
		// só é possível editá-lo caso ele exista
    if (account) {
        // se o novo dado não foi definido, então mantém o que já existe
        account.id = newId || account.id
        account.ownerName = newOwnerName || account.ownerName
        account.type = newType || account.type

			// quando o valor for um número, é possível que seja 0 (que também é falsy)
			// então para possibilitar que venha 0, podemos fazer um ternário
			// o isNaN é uma função que checa se o argumento é um número ou não
			// caso não seja um número o isNaN retorna true, caso contrário false
			// por isso mantemos o antigo (pet.age) no true e atualizamos no false
			account.balance = isNaN(Number(newBalance)) ? account.balance : newBalance as number
    }

    res.status(200).send("Atualização realizada com sucesso")
})

