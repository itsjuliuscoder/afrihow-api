const express = require('express')
const joi = require('joi')
const bcrypt = require('bcrypt')
const app = express()

app.use(express.json())

const port = process.env.PORT || 3000;

const users = []

app.get('/users', (req, res) => {
	res.json(users)
});

app.post('/users', async (req, res) => {
	try {
		const schema = {
			name: joi.string().min(3).required(),
			password: joi.required()
		};

		const result = joi.validate(req.body, schema);
		if (result.error) {
			res.status(400).send(result.error);
			return;
		}

		const salt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(req.body.password, salt)
		const user = { name: req.body.name, password: hashedPassword }
		users.push(user)
		res.status(201).send(user)
		hash('password')
	} catch {
		res.status(500).send()
	}
});

app.post('/users/login', async(req, res) => {
	const user = users.find(user => user.name === req.body.name)
	if (user == null) {
		return res.status(400).send('cannot find user')
	}
	try {
		if (await bcrypt.compare(req.body.password, user.password)) {
			res.send('success')
		} else {
			res.send('incorrect password')
		}
	} catch {
		res.status(500).send()
	}
})

app.listen(port, () => console.log('Server listening on port ' + port + '...'));