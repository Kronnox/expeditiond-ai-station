import { Component, DoCheck, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WotPopoverComponent } from 'src/app/common/popover/wot-popover/wot-popover.component';
import { ImageObject } from 'src/app/drag-and-drop/model/image/image-object';
import { BackendService } from 'src/app/shared/backend.service';
import { ImageService } from 'src/app/shared/image.service';
import { WotSuccessOverlayComponent } from "../../common/layout/wot-success-overlay/wot-success-overlay.component";
import { animate, keyframes, query, stagger, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-data-overview',
  templateUrl: './data-overview.component.html',
  styleUrls: ['./data-overview.component.scss'],
  animations: [
    trigger('imageAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('5ms', [
          animate('.2s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))]), { optional: true }),
      ]),
    ])
  ]
})
export class DataOverviewComponent implements OnInit {

  @HostListener('scroll')
  handleScroll() {
    this.popover.setInvisible();
  }

  @ViewChild('successOverlay') public successOverlay: WotSuccessOverlayComponent;
  @ViewChild('popover') public popover: WotPopoverComponent;

  public images: ImageObject[] = [];
  private descriptions: string[] = [];

  private indexPerClass: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  private descriptionsDic: string[][] = [
    ['Salacia ist ein Asteroid des Kuipergürtels mit einem Durchmesser von 900 km. Sollte er uns begegnen, müssen wir ihn zerstören, bevor er uns zerstört.',
      'Der Asteroid Psyche hätte uns in einer Mission beinahe zerstört. Zum Glück konnten wir ihn rechtzeitig abschießen.',
      'Der Asteroid Juno kam in der letzten Mission dem Truck gefährlich nahe und hätte uns beinahe großen Schaden zugefügt.',
      'Huma ist ein Asteroid vom Amor-Typ. Unser Waffensystem konnte ihn neutralisieren.',
      'Dieser Asteroid hat unserem Truck großen Schaden zugefügt.'],
    ['Das ist Leo. Ihn mussten wir auf einer früheren Mission in der Nähe des Mars aufsammeln.',
      'Astronautin Pia konnten wir in unserer letzten Mission leider nicht retten. Nun schwebt sie immer noch durch das All und fehlt in unserer Crew.',
      'Das ist Feli. Sie mussten wir in einer Rettungsmission beim Jupiter aufsammeln.',
      'Das ist der Astronaut Rico. Eine Rettungsmission schlug fehl. Seither wird er vermisst.',
      'Der Astronaut Luca ist ein wichtiger Teil unserer Mannschaft. Ihn haben wir beim Jupiter aufgesammelt.'],
    ['Das ist der Tesla Roadster, der 2018 von Elon Musk ins Weltall geschossen wurde.',
      'Mars-Rover aus der ersten bemannten Mars-Mission',
      'Ein Auto? Wie kommt das denn hierher? Immer dieser Musk …',
      'Das ist ein Auto. In der Regel lassen wir Autos vorbeifliegen.',
      'Dieses Auto enthielt wertvolle Bauteile, die wir in unseren Truck einbauen konnten.'],
    ['Dieser Brief enthält geheime Informationen, die nicht in fremde Hände geraten dürfen.',
      'Botschaften an unsere Crewmitglieder von ihren Familien. Das erhöht die Motivation im Team.',
      'In diesem Brief hat uns die Zentrale wichtige Informationen zu unserer Mission mitgeteilt.',
      'Dieser Brief enthält das Passwort für unser Bitcoin Wallet mit 100.000 Bitcoin. Ein Verlust des Briefs wäre sehr teuer.',
      'Dieser Brief beinhaltet die Coca-Cola-Geheimrezeptur. Diese darf nicht von Außerirdischen entdeckt werden.'],
    ['Dies ist ein Space Shuttle der USA. Es half uns im Kampf gegen die UFOs.',
      'Die Falcon Heavy Rakete von SpaceX hat wichtige Satelliten ins All gebracht.',
      'Dieses freundliche Raumschiff verwechselte einer unserer Schützen mit einem UFO und schoss es ab. Das führte zu diplomatischen Schwierigkeiten.'],
    ['Starlink-Satellit, der Internet für die Welt bereitstellt. Wir haben ihn vorbeifliegen lassen.',
      'Dieser Satellit dient der Kommunikation mit unserem Kontrollzentrum. Er muss auf seiner Umlaufbahn bleiben.',
      'WGS 6 ist ein Satellit des US-Verteidigungs-ministeriums. Die Umlaufbahn des Satelliten dürfen wir auf keinen Fall beeinflussen.',
      'Diesen Satelliten haben wir in einer Mission versehentlich abgeschossen. Dies führte zu einem weltweiten Ausfall von GPS.',
      'Dieser Satellit versorgt uns auf dem Truck mit Fernsehen. Ein Verlust würde die Crew schwer treffen.'],
    ['Teil der alten russischen Raumstation MIR. Die Teile können für die Reparatur des Trucks verwendet werden.',
      'Satellitenschüssel mit unbekannter Technik. Wir haben sie weiterfliegen lassen.',
      'Die Teile dieser Satellitenschüssel können für die Reparatur des Trucks verwendet werden.'],
    ['TL-435 ist das erste bekannte UFO. Es hat uns direkt angegriffen und den Truck fast zerstört.',
      'ESV-98 attackierte unseren Truck in der Mission im Jahr 2020 und musste neutralisiert werden.',
      'Dieses UFO zerstörte einen anderen Truck der expedition-d-Flotte.',
      'Dieses UFO hat uns beim Uranus fast zerstört.',
      'Das UFO hat uns schweren Schaden zugefügt, bis wir es zerstören konnten.'],
    ['Versorgungsbox, die mit lebenswichtigen Gegenständen gefüllt ist. Hätten wir sie in der Mission 1-X3 nicht eingesammelt, wäre unsere Crew verhungert.',
      'Schatztruhe mit unbekanntem Inhalt',
      'Versorgungsbox, die uns für die letzte Mission geschickt wurde. Sie enthielt Gegenstände, die auf keinen Fall in feindliche Hände geraten dürfen.',
      'Diese Versorgungsbox hat uns in einer Mission mit wichtigen Hilfsgütern versorgt. Sie muss unbedingt aufgesammelt werden.',
      'Diese Versorgungsbox haben wir in einer Mission beim Saturn eingesammelt.']

  ];

  constructor(private router: Router, private imageService: ImageService) { }

  ngOnInit(): void {
    let imgs = this.imageService.getNImagesOfEach(10);
    while (imgs.length > 0) {
      const index = Math.trunc(Math.random() * imgs.length);
      imgs[index]
      this.images.push(imgs[index]);

      const indexPerClass = this.indexPerClass[imgs[index].predictedClass]++;

      const desc = Math.trunc(indexPerClass % this.descriptionsDic[imgs[index].predictedClass].length);
      this.descriptions.push(this.descriptionsDic[imgs[index].predictedClass][desc]);
      imgs.splice(index, 1);
    }
  }

  public done(): void {
    this.popover.setInvisible();
    this.successOverlay.setVisible();
  }

  public continue(): void {
    void this.router.navigate(['/data-creation']);
  }

  public showInfo(event: Event, i: number): void {
    this.popover.setInvisible();
    const target: Element = event.target as Element;
    this.popover.setVisible(target, this.descriptions[i]);
  }
}
