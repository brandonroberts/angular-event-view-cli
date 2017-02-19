import { TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { NgModule, DebugElement, NO_ERRORS_SCHEMA, Component, NgModuleFactoryLoader }    from '@angular/core';
// import { NgModuleFactoryLoader } from '@angular/core';
import { AppComponent } from './app.component';

import { Router, RouterModule } from '@angular/router';


// import { HttpModule } from '@angular/http';
// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryStoreService } from '../api/in-memory-store.service';
import { routes } from './app-routing.module';
// import { SpeakerService } from './models';
import { PageNotFoundComponent } from './page-not-found.component';
// import { CoreModule } from './core/core.module';
// import { LoginModule } from './login/login.module';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
// import { Speaker } from './models';

// class SpeakerServiceStub extends SpeakerService {
//   private getObservableSpeaker() {
//     const subject = new BehaviorSubject(new Speaker());
//     const retVal = subject.asObservable();
//     return <Observable<Speaker>>retVal;
//   }
//   addSpeaker(speaker: Speaker) {
//     return this.getObservableSpeaker();
//   }
//
//   deleteSpeaker(speaker: Speaker) {
//     return this.getObservableSpeaker();
//   }
//   getSpeakers() {
//     const subject = new BehaviorSubject([new Speaker()]);
//     const retVal = subject.asObservable();
//     return <Observable<[Speaker]>>retVal;
//   }
//   getSpeaker(id: number) {
//     return this.getObservableSpeaker();
//   }
//   updateSpeaker(speaker: Speaker) {
//     return this.getObservableSpeaker();
//   }
// }

@Component({
  template: '<span>lazy-loaded</span>'
})
class LazyComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: LazyComponent }
    ])
  ],
  declarations: [
    LazyComponent
  ]
})
class LazyModule {}

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [AppComponent, PageNotFoundComponent],
      providers: [],
      schemas: [
        /**
        * This tells the compiler to ignore any unknown elements
        * in the component template. This way we can only test
        * what we need to without bringing in all the dependencies.
        */
        NO_ERRORS_SCHEMA
      ]
    });
    TestBed.compileComponents();
  });

  // const loader = TestBed.get(NgModuleFactoryLoader);
  // class LoadedModule { }
  // router.resetConfig([
  //   { path: 'lazy', loadChildren: 'lazyModule' },
  // ]);

  it('true is true', () => expect(true).toBe(true));

  it('should be defined', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should contain a navigation component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('ev-nav').length).toBe(1);
  });

  it('should render a 404 route', fakeAsync(inject([Router], (router: Router) => {
    const fixture = TestBed.createComponent(AppComponent);

    router.navigate(['/invalid']);

    tick();
    fixture.detectChanges();
    tick();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('Inconceivable!');
  })));

  it('should lazy load a dashboard module', fakeAsync(inject([Router, NgModuleFactoryLoader], (router: Router, loader: NgModuleFactoryLoader) => {
    const fixture = TestBed.createComponent(AppComponent);

    loader.stubbedModules = {
      'app/dashboard/dashboard.module#DashboardModule': LazyModule
    };

    router.navigate(['/dashboard']);

    tick();
    fixture.detectChanges();
    tick();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('span').textContent).toContain('lazy-loaded');
  })));

  // it('should create the app', async(() => {

  //   fakeAsync(inject([Router, Location], (router: Router, location: Location) => {

  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();

  //   expect(location.path()).toEqual('/include/user/kate');
  // }));

  // it(`should have as title 'app works!'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app works!');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));
});
