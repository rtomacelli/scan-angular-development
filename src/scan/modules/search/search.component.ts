import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';

import { SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { OverlayPanel } from 'primeng/overlaypanel';

import { formatSortableText } from '@helpers/string.helper';
import { validateData, ValidityCondition } from '@helpers/validation.helper';
import { App, AppPortfolio, BusinessService } from '@models/app-portfolio';
import { MatrixElement } from '@models/reference-matrix';
import { SelectItemValue } from '@models/ui';
import { AppPortfolioService } from '@services/app-portfolio.service';
import { ReferenceDateService } from '@services/reference-date.service';
import { ReferenceMatrixService } from '@services/reference-matrix.service';

@Component({
  selector: 'scan-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('opPath', { static: false }) opPathRef: OverlayPanel;
  @ViewChild('toolbar', { static: false }) toolbar: ElementRef<HTMLDivElement>;

  options: SelectItem[] = [];
  selectedOption: BusinessService | App | MatrixElement;
  hovered: SelectItemValue;
  availableHeight: number;
  isDataValid = true;
  errorMessage = '';
  optionsLoaded: boolean;

  private subscriptions: Subscription = new Subscription();

  suggestionKeys: { [type: string]: string[] } = {
    interface: [
      'Gerenciador Financeiro GFN Web',
      'Autoatendimento Pessoa Física APF Mobile',
      'Plataforma BB Web',
      'Ourocard-e Mobile'
    ],
    service: ['AS1001', 'AS1103', 'AS1139', 'AS1249'],
    app: ['IMA', 'OPR', 'PAJ', 'VIP']
  };
  suggestionTypes = ['interface', 'service', 'app'];
  suggestions: { [type: string]: SelectItem[] } = {};

  constructor(
    private appPortfolioService: AppPortfolioService,
    private changeDetectorRef: ChangeDetectorRef,
    private referenceDateService: ReferenceDateService,
    private referenceMatrixService: ReferenceMatrixService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.referenceDateService.getReferenceDate().subscribe(() => this.loadOptions()));
  }

  ngAfterViewInit() {
    this.updateAvailableHeight();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Loads options for the search box, requesting in parallel the Application
   * Portfolio and the Reference Matrix using `AppPortfolioService` and
   * `ReferenceMatrixService`, respectively.
   *
   * @private
   * @memberOf SearchComponent
   */
  private loadOptions() {
    this.optionsLoaded = false;
    this.subscriptions.add(
      forkJoin([
        this.appPortfolioService.getAppPortfolio(),
        this.referenceMatrixService.getApplicationInterfaces()
      ]).subscribe(([portfolio, interfaces]) => {
        this.populateOptions(portfolio, interfaces);
        this.populateSuggestions();
      })
    );
  }

  /**
   * Calculates and updates the height available for the search dropdown.
   *
   * @private
   * @memberof SearchComponent
   */
  private updateAvailableHeight() {
    const headerHeight = this.toolbar.nativeElement.scrollHeight;
    const availableHeight = window.innerHeight - 3 * headerHeight; // 3 = header + toolbar + filter

    this.changeDetectorRef.detach();
    this.availableHeight = availableHeight;
    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.reattach();
  }

  /**
   * Populates the list of search options with the Business Services and
   * Applications from the Application Portfolio and the Application Interfaces
   * from the Reference Matrix, then signals the template that the options
   * have been loaded.
   *
   * @private
   * @param {AppPortfolio} appPortfolio The Application Portfolio.
   * @param {MatrixElement[]} interfaces An array of Application Interface
   * elements.
   * @memberof SearchComponent
   */
  private populateOptions(appPortfolio: AppPortfolio, interfaces: MatrixElement[]) {
    this.options = this.makeOptions(
      appPortfolio.businessServices || [],
      appPortfolio.apps || [],
      interfaces || []
    );
    this.optionsLoaded = true;
    this.isDataValid = this.checkData(appPortfolio, interfaces);
  }

  /**
   * Determines whether the loaded data is valid.
   *
   * @private
   * @param {AppPortfolio} appPortfolio The Application Portfolio.
   * @param {MatrixElement[]} interfaces An array of Application Interface
   * elements.
   * @returns {boolean} `true` if the data is valid; `false` otherwise.
   * @memberof SearchComponent
   */
  private checkData(appPortfolio: AppPortfolio, interfaces: MatrixElement[]): boolean {
    const conditions: ValidityCondition[] = [{
      isValid: !!appPortfolio && appPortfolio.businessServices.length > 0,
      invalidMessage: 'Portfólio de Aplicativos incompleto'
    }, {
      isValid: !!appPortfolio.apps && appPortfolio.apps.length > 0,
      invalidMessage: 'siglas não encontradas'
    }, {
      isValid: interfaces.length > 0,
      invalidMessage: 'interfaces de aplicativo não encontradas'
    }];

    this.errorMessage = validateData(conditions);
    return this.errorMessage.length === 0;
  }

  /**
   * Builds the options for the search dropdown.
   *
   * @private
   * @param {BusinessService[]} services An array of Business Services from the
   * Application Portfolio.
   * @param {App[]} apps An array of Apps from the Application Portfolio.
   * @param {MatrixElement[]} interfaces An array of Application Interfaces
   * from the Reference Matrix.
   * @returns {SelectItem[]} An array of options for the search dropdown.
   * @memberof SearchComponent
   */
  private makeOptions(services: BusinessService[], apps: App[], interfaces: MatrixElement[]): SelectItem[] {
    let options: SelectItem[] = [];
    if (interfaces && interfaces.length) {
      options = options.concat(this.makeElementOptions(interfaces));
    }
    if (services && services.length) {
      options = options.concat(this.makeServiceOptions(services));
    }
    if (apps && apps.length) {
      options = options.concat(this.makeAppOptions(apps));
    }
    return options.sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * Maps an array of Business Services to an array of options for the search
   * dropdown.
   *
   * @private
   * @param {BusinessService[]} services An array of every Business Service in
   * the Application Portfolio.
   * @returns {SelectItem[]} An Array of Business Service options for the
   * search dropdown.
   * @memberof SearchComponent
   */
  private makeServiceOptions(services: BusinessService[]): SelectItem[] {
    return services.map(service => ({
      label: formatSortableText(service.nome),
      title: 'Assunto',
      value: this.makeServiceValue(service)
    })).sort((a, b) => a.value.name.localeCompare(b.value.name));
  }

  /**
   * Creates a search option value for a Business Service.
   *
   * @private
   * @param {BusinessService} service The Business Service from the Application
   * Portfolio.
   * @returns {SelectItemValue} The corresponding value.
   * @memberof SearchComponent
   */
  private makeServiceValue(service: BusinessService): SelectItemValue {
    return {
      segment: service.path.segment.code,
      tag: service.codigo,
      name: service.nome,
      description: service.descricao,
      status: '',
      key: service.codigo,
      path: service.path,
      type: 'service',
      typeTag: 'Assunto'
    };
  }

  /**
   * Maps an array of Applications to an array of options for the search
   * dropdown.
   *
   * @private
   * @param {App[]} services An array of every Application in the Application
   * Portfolio.
   * @returns {SelectItem[]} An Array of Application options for the search
   * dropdown.
   * @memberof SearchComponent
   */
  private makeAppOptions(apps: App[]): SelectItem[] {
    return apps.map(app => ({
      label: formatSortableText(app.nome),
      title: 'Sigla',
      value: this.makeAppValue(app)
    })).sort((a, b) => a.value.tag.localeCompare(b.value.tag));
  }

  /**
   * Creates a search option value for an Application.
   *
   * @private
   * @param {App} service The Application from the Application Portfolio.
   * @returns {SelectItemValue} The corresponding value.
   * @memberof SearchComponent
   */
  private makeAppValue(app: App): SelectItemValue {
    return {
      segment: app.path.segment.code,
      tag: app.codigo,
      name: app.nome,
      description: app.objetivos,
      status: app.estado,
      key: app.codigo,
      path: app.path,
      type: 'app',
      typeTag: 'Sigla'
    };
  }

  /**
   * Maps an array of Application Interface Elements to an array of options for
   * the search dropdown.
   *
   * @private
   * @param {MatrixElement[]} services An array of every Application Interface
   * Element in the Reference Matrix.
   * @returns {SelectItem[]} An Array of Application Interface options for the
   * search dropdown.
   * @memberof SearchComponent
   */
  private makeElementOptions(elements: MatrixElement[]): SelectItem[] {
    return elements.map(element => ({
      label: formatSortableText(element.nome),
      title: 'Interface',
      value: this.makeElementValue(element)
    })).sort((a, b) => a.value.name.localeCompare(b.value.name));
  }

  /**
   * Creates a search option value for an Application Interface Element.
   *
   * @private
   * @param {MatrixElement} service The Application Interface Element from the Reference
   * Matrix.
   * @returns {SelectItemValue} The corresponding value.
   * @memberof SearchComponent
   */
  private makeElementValue(element: MatrixElement): SelectItemValue {
    return {
      segment: '',
      tag: 'Interface',
      name: element.apelido || element.nome,
      description: element.apelido ? element.nome : '',
      status: '',
      key: element.nome,
      path: element.path,
      type: 'interface',
      typeTag: 'Interface'
    };
  }

  /**
   * Populates the suggestions grid.
   *
   * @private
   * @memberof SearchComponent
   */
  private populateSuggestions() {
    for (const type of this.suggestionTypes) {
      const typeOptions = this.options.filter(option => option.value.type as string === type);
      if (!!typeOptions && typeOptions.length > 0) {
        this.suggestions[type] = typeOptions
          .filter(option => this.suggestionKeys[type].includes((option.value as SelectItemValue).key));
      }
    }
  }

  /**
   * Displays the hierarchic path of the hovered search option.
   *
   * @param {SelectItemValue} value The hovered search option.
   * @param {*} $event The triggered event.
   * @memberof SearchComponent
   */
  showPath(value: SelectItemValue, $event: any) {
    this.hovered = value;
    this.opPathRef.show($event);
  }

  /**
   * Hides the hierarchic path overlay.
   *
   * @memberof SearchComponent
   */
  hidePath() {
    this.hovered = undefined;
    this.opPathRef.hide();
  }

  /**
   * Clears the search dropdown filter.
   *
   * @param {Dropdown} dropdown A reference to the search dropdown.
   * @memberof SearchComponent
   */
  clearFilter(dropdown: Dropdown) {
    dropdown.updateSelectedOption(null);
    dropdown.resetFilter();
  }

  /**
   * Handler for the selection of an option in the search dropdown.
   *
   * @param {*} $event The triggered event.
   * @memberof SearchComponent
   */
  onOptionChange($event: any) {
    this.goToMap($event.value as SelectItemValue);
  }

  /**
   * Handler for a click on an item of the suggestions grid.
   *
   * @param {SelectItem} suggestion The clicked suggestion.
   * @memberof SearchComponent
   */
  onSuggestionClick(suggestion: SelectItem) {
    this.goToMap(suggestion.value as SelectItemValue);
  }

  /**
   * Navigates to the map corresponding to the selected option.
   *
   * @private
   * @param {SelectItemValue} map The option corresponding to the desired map.
   * @memberof SearchComponent
   */
  private goToMap(map: SelectItemValue) {
    this.router.navigateByUrl(`/map/${map.type}/${map.key}`);
  }

}
