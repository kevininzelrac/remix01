// FIXME: Add JSDocs for everything
class RuleSet {
  constructor(queryEngine, rules) {
    this.queryEngine = queryEngine;
    this.rules = rules;
  }

  // Constructors
  static new(queryEngine) {
    return new RuleSet(queryEngine, {});
  }

  // Implementation
  allow(action, subjectType, condition) {
    return this._addRule(false, action, subjectType, condition);
  }

  // Implementation
  forbid(action, subjectType, condition) {
    return this._addRule(true, action, subjectType, condition);
  }

  // Signature/Implementation
  accessible(action, subjectType, ...args) {
    const actionConfig = this.rules[action];
    if (!actionConfig) {
      throw new Error(`No rule found for action: ${action}.`);
    }

    const rule = actionConfig[subjectType];
    if (!rule) {
      throw new Error(
        `No rule found for action: ${action}, subject type: ${subjectType}.`
      );
    }

    if (rule.filters.length === 0) {
      throw new Error(
        `No filters found on rule for action: ${action}, subject type: ${subjectType}.`
      );
    }

    const filterset = rule.filters.map((item) => item.getFilter(...args));

    if (this._hasPromiseElement(filterset)) {
      return Promise.all(filterset).then((conditions) =>
        this._getQueryEngineCondition(subjectType, rule.filters, conditions)
      );
    }

    return this._getQueryEngineCondition(subjectType, rule.filters, filterset);
  }

  /*
  FIXME: HAVE NOT DECIDED HOW THESE MUST WORK.
  public can(action: A, subjectType: T) {}
  public cannot(action: A, subjectType: T) {}
  */

  // Private methods
  _addRule(negate, action, subjectType, condition) {
    if (!(condition instanceof AbstractFilter)) {
      if (typeof condition === "function") {
        condition = new FunctionFilter(negate, condition);
      } else if (typeof condition === "undefined") {
        condition = new LiteralFilter(negate, true);
      } else {
        condition = new LiteralFilter(negate, condition);
      }
    }
    this.rules[action] = this.rules[action] ?? {};
    this.rules[action][subjectType] =
      this.rules[action][subjectType] ?? new Rule();
    const rule = this.rules[action][subjectType];
    rule.filters.push(condition);
    return this;
  }

  _hasPromiseElement(array) {
    return array.some((item) => this._isPromise(item));
  }

  _isPromise(value) {
    return (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      typeof value.then === "function"
    );
  }

  _getQueryEngineCondition(subjectType, filters, conditions) {
    const items = conditions.map((condition, idx) => {
      const negate = filters[idx].negate;

      if (typeof condition === "boolean") {
        if (condition) {
          condition = this.queryEngine.all(subjectType);
        } else {
          condition = this.queryEngine.none(subjectType);
        }
      }

      if (negate) {
        return this.queryEngine.negate(subjectType, condition);
      }
      return condition;
    });

    return this.queryEngine.and(subjectType, ...items);
  }
}

class Rule {
  constructor(filters = []) {
    this.filters = filters;
  }
}

class QueryEngine {
  all(subjectType) {}
  none(subjectType) {}
  and(subjectType, ...terms) {}
  negate(subjectType, condition) {}
}

class AbstractFilter {
  constructor(negate) {
    this.negate = negate;
  }

  getFilter;
}

class LiteralFilter extends AbstractFilter {
  constructor(negate, filter) {
    super(negate);
    this.filter = filter;
  }

  getFilter = () => {
    return this.filter;
  };
}

class FunctionFilter extends AbstractFilter {
  constructor(negate, fn) {
    super(negate);
    this.fn = fn;
  }

  getFilter = (...args) => {
    return this.fn(...args);
  };
}
