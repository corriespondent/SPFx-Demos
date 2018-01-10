declare interface ISimpleWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ListNameFieldLabel: string;
}

declare module 'SimpleWebPartStrings' {
  const strings: ISimpleWebPartStrings;
  export = strings;
}
