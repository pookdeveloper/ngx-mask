import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    Input,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {
    JsonPipe,
    NgClass,
    NgFor,
    NgIf,
    NgOptimizedImage,
    NgTemplateOutlet,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { HighlightModule } from 'ngx-highlightjs';
import { IComDoc, IMaskOptions, TExample } from '@open-source/accordion/content.interfaces';
import { AssetPipe } from '@libraries/asset/asset.pipe';
import { IsEmptyPipe } from '@open-source/is-empty/is-empty.pipe';
import { ColorPipe } from '@open-source/color/color.pipe';
import { CardContentComponent } from '../shared/card-content/card-content.component';
import { TrackByService } from '@libraries/track-by/track-by.service';
import { ScrollService } from '@open-source/service/scroll.service';
import { Router } from '@angular/router';
import { debounceTime, fromEvent, takeUntil } from 'rxjs';
import { UnSubscriber } from '@libraries/unsubscriber/unsubscriber.service';

@Component({
    selector: 'jsdaddy-open-source-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: true,
    providers: [ScrollService],
    imports: [
        JsonPipe,
        NgFor,
        NgIf,
        NgClass,
        NgOptimizedImage,
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
        HighlightModule,
        NgxMaskDirective,
        NgxMaskPipe,
        AssetPipe,
        IsEmptyPipe,
        ColorPipe,
        CardContentComponent,
    ],
})
export class OptionsComponent extends UnSubscriber implements AfterViewInit {
    @Input() public cardDocs!: IComDoc[];
    @Input() public cardExamples!: (TExample<IMaskOptions> | { _pipe: string })[];

    @ViewChildren('cards') public cards!: QueryList<ElementRef>;

    public phone = '123456789';
    public activeCardId = 1;
    public readonly trackByPath = inject(TrackByService).trackBy('id');

    private readonly scrollService = inject(ScrollService);
    private readonly router = inject(Router);

    public ngAfterViewInit(): void {
        fromEvent(document, 'scroll')
            .pipe(takeUntil(this.unsubscribe$$), debounceTime(100))
            .subscribe(() => {
                const scrollIdCard = this.cards.find((e) =>
                    this.scrollService.isInViewport(e.nativeElement)
                )?.nativeElement.id;
                if (this.activeCardId !== Number(scrollIdCard)) {
                    this.activeCardId = Number(scrollIdCard);
                    this.router.navigate(['/'], {
                        fragment: scrollIdCard,
                    });
                }
            });
        this.cards.changes.pipe(takeUntil(this.unsubscribe$$)).subscribe((elementRef) => {
            this.router.navigate(['/'], {
                fragment: '1',
            });
            const firstNativeElement: HTMLElement | null = document.getElementById(
                elementRef.first.nativeElement.id
            );
            if (firstNativeElement) {
                firstNativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }
}