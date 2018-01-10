import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './SimpleWebPart.module.scss';
import * as strings from 'SimpleWebPartStrings';

import * as jQuery from 'jquery';
import 'jqueryui';
import { SPComponentLoader } from '@microsoft/sp-loader';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface ISimpleWebPartProps {
  description: string;
  listName: string;
}

export interface AccordionList {
  value: AccordionItem[];
}

export interface AccordionItem {
  "Title": "",
  "PublishingPageContent" : ""
}

export default class SimpleWebPart extends BaseClientSideWebPart<ISimpleWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div id="spListContainer" class="accordion"></div>
      `;

      this._renderListAsync();

      
  }
  
  public constructor() {
    super();
 
    SPComponentLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
  }

  private _renderListAsync(): void {
    this._getListData()
      .then((response) => {
        console.log("response: ");
        console.log(response.value);
        this._renderList(response.value);
      });
    
  }

  private _renderList(items: AccordionItem[]): void {
    let html: string = '';
    items.forEach((item: AccordionItem) => {
      html += `
      <h3>${item.Title}</h3>
      <div>
      ${item.PublishingPageContent}
      </div>`;
    });

 
    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;

    // initialize jquery accordion
    const accordionOptions: JQueryUI.AccordionOptions = {
      animate: true,
      collapsible: false,
      icons: {
        header: 'ui-icon-circle-arrow-e',
        activeHeader: 'ui-icon-circle-arrow-s'
      }
     };

     jQuery('.accordion', this.domElement).accordion(accordionOptions);
  }

  private _getListData(): Promise<AccordionList> {

    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('Accordion')/items?$select=Title,%20PublishingPageContent,PXLML_DisplayOrder&$orderBy=PXLML_DisplayOrder%20asc`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      return response.json();
    });
  }
    
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
