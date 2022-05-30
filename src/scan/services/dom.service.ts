import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) { }

  appendComponent(selector: string, component: any): ComponentRef<any> {
    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);
    /*
      At this point, you can bind data to the component's inputs:
      componentRef.instance.myInput = 'yay';
    */
    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.applicationRef.attachView(componentRef.hostView);
    // 3. Get DOM element from component
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    // 4. Append DOM element to the body
    document.querySelector(selector).appendChild(domElement);
    return componentRef;
  }

  removeComponent(componentRef: ComponentRef<any>) {
    this.applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

}
