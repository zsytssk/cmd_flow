export class Model {
  constructor(...behaves: Behave[]) {
    this.addBehave(...behaves);
  }
  private behaves: Behave[] = [];
  public addBehave(...behaves: Behave[]) {
    for (const behave of behaves) {
      this.behaves.push(behave);
    }
  }
  public getBehaveByName<T extends Behave>(name): T {
    for (const behave of this.behaves) {
      if (behave.name === name) {
        return behave as T;
      }
    }
    return;
  }
  public getBehaveByCtor<T extends Behave>(ctor: Ctor<T>): T {
    for (const behave of this.behaves) {
      if (behave instanceof ctor) {
        return behave;
      }
    }
    return;
  }
}

export class Behave<T = Model> {
  public readonly name?: string;
  protected model: T;
  constructor(data: T, name?: string) {
    this.model = data;
    if (name) {
      this.name = name;
    }
  }
  protected setData(props: Partial<T>) {
    const { model: data } = this;
    for (const key in props) {
      if (!props.hasOwnProperty(key)) {
        continue;
      }
      data[key] = props[key];
    }
  }
}
