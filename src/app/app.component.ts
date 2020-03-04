import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
declare var window;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'integracao-mpgao';
  @ViewChild(ToastContainerDirective, null) toastContainer: ToastContainerDirective;
  
  payment = {
    email: null as string,
    description: 'Teste de integração de sistema',
    cardNumber: null as string,
    securityCode: null as string,
    cardExpirationMonth: null as string,
    cardExpirationYear: null as string,
    cardholderName: null as string,
    docType: null as string,
    docNumber: null as string,
    installments: 1 as number,
    token: null as string,
    paymentMethodId: null as string,
    expiration: null as string
  };

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer;
  }

  pay() {
    this.payment.cardExpirationMonth = this.payment.expiration.split('/')[0]
    this.payment.cardExpirationYear = this.payment.expiration.split('/')[1]
    if (this.payment.docType == null) {
      this.payment.docType = 'CPF';
    }
    window.Mercadopago.createToken(this.payment, (status, result) => {
      if (status === 200) {
        this.payment.token = result.id;
        window.Mercadopago.getPaymentMethod({ bin: result.first_six_digits }, (sts, ret) => {
          this.payment.paymentMethodId = ret.id;
        });

        this.doPayment();
      } else if (status === 400) {
        for (const error of result.cause) {
          this.toastr.error(error.description);
        }
      }
    });
  }

  doPayment() {
    const url = 'http://localhost:5000/api/pay';
    this.http.post(url, this.payment).toPromise().then((result: any) => {
      console.log(result);
      if (result && result.status === "approved"){
        this.toastr.success("Pagamento aprovado!");
      } else {
        this.toastr.error("Pagamento rejeitado");
      }
    })
  }
}
