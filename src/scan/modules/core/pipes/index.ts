import { BytesPipe } from './bytes.pipe';
import { DocumentationPipe } from './documentation.pipe';
import { OptionalLineBreaksPipe } from './optional-line-breaks.pipe';
import { SortableLabelPipe } from './sortable-label.pipe';
import { ToIdentifierPipe } from './to-identifier.pipe';

export const array: any[] = [
  BytesPipe,
  DocumentationPipe,
  OptionalLineBreaksPipe,
  SortableLabelPipe,
  ToIdentifierPipe
];

export { BytesPipe } from './bytes.pipe';
export { DocumentationPipe } from './documentation.pipe';
export { OptionalLineBreaksPipe } from './optional-line-breaks.pipe';
export { SortableLabelPipe } from './sortable-label.pipe';
export { ToIdentifierPipe } from './to-identifier.pipe';
