import { PortfolioPathLevel } from '@models/app-portfolio';

export interface PortfolioPath {
  'segment': PortfolioPathLevel;
  'grouping'?: PortfolioPathLevel;
  'areaOfInterest'?: PortfolioPathLevel;
  'businessService'?: PortfolioPathLevel;
  'app'?: PortfolioPathLevel;
  'secondaryServices'?: string[];
  'secondaryAreasOfInterest'?: string[];
  'inactiveServices'?: string[];
  'relatedApps'?: string[];
}
