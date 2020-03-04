var express = require('express');
var mercadopago = require('mercadopago');
var cors = require('cors');

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
mercadopago.configurations.setAccessToken("TEST-8091854411019981-030215-33c868590b7024823c2acf4bc03bae61-261293516");

app.post('/api/pay', (req, res) => {
    if(req.body){
      let valor = (Math.random() * (1000 - 1) + 1)
      var payment_data = {
        token: req.body.token,
        transaction_amount: Math.ceil(valor),
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.paymentMethodId,
        payer: {
          email: req.body.email
        }
      };
      mercadopago.payment.save(payment_data).then(function (data) {
          res.status(200).send(data.response);
      }).catch(function (error) {
          res.send({erro: error})
      });
    }
});
const PORT = 5000;

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
});