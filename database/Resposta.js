const Sequelize = require("sequelize")
const connection = require("./database")

const Resposta = connection.define('resposta', {
    answer:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    pergunta_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

// Se a tabela pergunta já existir, não será froaçada a criação
Resposta.sync({force: false}).then(() => {})

module.exports = Resposta
