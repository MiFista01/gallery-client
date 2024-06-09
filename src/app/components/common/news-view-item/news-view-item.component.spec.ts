import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsViewItemComponent } from './news-view-item.component';

describe('NewsViewItemComponent', () => {
  let component: NewsViewItemComponent;
  let fixture: ComponentFixture<NewsViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsViewItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
