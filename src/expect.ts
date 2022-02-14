export class AssertionBuilder {
  get classes() {
    return new FirstStageAssertion(false)
  }
  get noClasses() {
    return new FirstStageAssertion(true)
  }
}

export class FirstStageAssertion {
  constructor(private readonly negated: boolean) {}
  get that() {
    return this
  }
  get isNegative() {
    return this.negated
  }
  get not() {
    return new FirstStageAssertion(!this.negated)
  }
}

/**
 * Declares a forced friend type for opaque members.
 */
export type Friend<A extends {}, Fields extends {}> = {
  [K in keyof A]: A[K]
} & Fields

type FriendClassAssertion = Friend<ClassAssertion, { readonly no: boolean }>

export class ThatClassAssertion {
  constructor(private readonly parent: FriendClassAssertion) {}
  get clogged() {
    return this.parent.no
  }
}

export class ClassAssertion {
  constructor(private readonly no = false) {}
  get that() {
    return new ThatClassAssertion(this as any)
  }
}

export function classes() {
  return new ClassAssertion()
}

export function noClasses() {
  return new ClassAssertion(true)
}
