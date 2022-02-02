import { Injectable } from '@angular/core';
import { SplitFactory, InLocalStorage } from '@splitsoftware/splitio-browserjs';
import { fromEvent, Subscription } from 'rxjs';

@Injectable()
export class SplitioService {
  /**
   * The local reference to the Split SDK.
   */
  splitio: SplitIO.ISDK;
  /**
   * The local reference to the Split SDK's Client.
   */
  splitClient: SplitIO.IClient;
  /**
   * Flag to determine if SDK is ready or not.
   */
  isReady = false;
  /**
   * The local reference to the list of Treatments.
   */
  treatments: SplitIO.Treatments;
  /**
   * The local reference to the a Treatment.
   */
  treatment: SplitIO.Treatment;
  /**
   * The list of Features/Split from which to get the corresponding
   * treatments.
   */
  features: string[] = [
    'GPK_OrderItem_Checklist_Enabled'
  ];
  /**
   * The local reference to the SDK's ready Observable.
   */
  subscription: Subscription;
  /**
   * This method initializes the SDK with the required Browser APIKEY
   * and the 'key' according to the Traffic type set (ex.: an user id).
   *
   * @returns void
   */
  initSdk(): void {
    this.splitio = SplitFactory({
      core: {
        authorizationKey: 'ujlp2rr8ls735k1gle4lmnapuef43o7flemu',
        key: 'ranjith.bodla@gopuff.com'
      },
      storage: InLocalStorage({
        prefix: 'TEST_PREFIX'
      })
    });
    this.splitClient = this.splitio.client();
    // verify if sdk is initialized
    this.verifyReady();
  }
  /**
   * Function to check if the SDK is ready, subscribe to an Observable
   * and set the isReady flag according to the result.
   *
   * @returns void
   */
  private verifyReady(): void {
    const isReadyEvent = fromEvent(this.splitClient, this.splitClient.Event.SDK_READY);

    this.subscription = isReadyEvent.subscribe({
      next() {
        this.isReady = true;
        console.log('Sdk ready: ', this.isReady);
      },
      error(err) {
        console.log('Sdk error: ', err);
        this.isReady = false;
        this.unsubscribeSDK();
      }
    });
  }
  /**
   * Function to get and set the treatments from the Split API.
   *
   * @returns void
   */
  getTreatments(): void {
    this.treatments = this.splitClient.getTreatments(this.features);
    console.log(this.treatments);
  }

  attributes: SplitIO.Attributes = {
    venueId : 351
  };

  getAttributeTreatment(): void {
    this.treatment = this.splitClient.getTreatment(this.features[0], this.attributes);
    console.log(`treatment is ${this.treatment}`);
  }
  /**
   * Function to unsubscribe the Observable from the SDK initialization.
   *
   * @returns void
   */
  unsubscribeSDK(): void {
    this.subscription.unsubscribe();
  }
}
