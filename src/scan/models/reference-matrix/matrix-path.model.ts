import { MatrixPathLevel } from '@models/reference-matrix';

export class MatrixPath {

  constructor(
    public layer: MatrixPathLevel,
    public perspective?: MatrixPathLevel,
    public group?: MatrixPathLevel,
    public subgroup?: MatrixPathLevel,
    public element?: MatrixPathLevel
  ) { }

  get fullPath(): string[] {
    return [this.layer, this.perspective, this.group, this.subgroup, this.element]
      .filter(level => !!level)
      .map(level => level.name);
  }

  public pathMatch(path: string[], strict?: boolean): boolean {
    const fullPath = this.fullPath;
    if (fullPath.length !== path.length) {
      return false;
    }
    for (let i = 0; i < path.length; i++) {
      if ((strict || path[i] !== '*') && path[i] !== fullPath[i]) {
        return false;
      }
    }
    return true;
  }

}
