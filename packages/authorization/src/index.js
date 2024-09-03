class RuleSet {
  /**
   *
   * @param {QueryEngine} queryEngine
   * @param {object} rules
   */
  constructor(queryEngine, rules) {
    /**
     * @type {QueryEngine}
     */
    this.queryEngine = queryEngine;
    /**
     * @type {object}
     */
    this.rules = rules;
  }

  /**
   *
   * @param {QueryEngine} queryEngine
   * @returns {RuleSet}
   */
  static new(queryEngine) {
    return new RuleSet(queryEngine, {});
  }

  /**
   *
   * @param {string} action
   * @param {string} subjectType
   * @param {boolean | function | AbstractFilter | any} [condition]
   * @returns {RuleSet}
   */
  allow(action, subjectType, condition) {
    return this._addRule(false, action, subjectType, condition);
  }

  /**
   *
   * @param {string} action
   * @param {string} subjectType
   * @param {boolean | function | AbstractFilter | any} [condition]
   * @returns {RuleSet}
   */
  forbid(action, subjectType, condition) {
    return this._addRule(true, action, subjectType, condition);
  }

  /**
   *
   * @param {string} action
   * @param {string} subjectType
   * @param  {...any} args
   * @returns
   */
  accessible(action, subjectType, ...args) {
    const actionConfig = this.rules[action];
    if (!actionConfig) {
      throw new Error(`No rule found for action: ${action}.`);
    }

    /** @type {Rule | undefined} */
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

  /**
   *
   * @param {boolean} negate
   * @param {string} action
   * @param {string} subjectType
   * @param {boolean | function | AbstractFilter | any} condition
   * @returns {RuleSet}
   */
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

  /**
   *
   * @param {Array} array
   * @returns {boolean}
   */
  _hasPromiseElement(array) {
    return array.some((item) => this._isPromise(item));
  }

  /**
   *
   * @param {any} value
   * @returns {boolean}
   */
  _isPromise(value) {
    return (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      typeof value.then === "function"
    );
  }

  /**
   *
   * @param {string} subjectType
   * @param {AbstractFilter[]} filters
   * @param {Array<boolean | any>} conditions
   * @returns {any}
   */
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
  /**
   *
   * @param {AbstractFilter[]} filters
   */
  constructor(filters = []) {
    /**
     * @type {AbstractFilter[]}
     */
    this.filters = filters;
  }
}

class NotImplementedError extends Error {
  constructor() {
    super("Not implemented.");
  }
}

/**
 * @abstract
 */
class QueryEngine {
  /**
   *
   * @param {string} subjectType
   * @returns {any}
   */
  all(subjectType) {
    throw new NotImplementedError();
  }

  /**
   *
   * @param {string} subjectType
   * @returns {any}
   */
  none(subjectType) {
    throw new NotImplementedError();
  }

  /**
   *
   * @param {string} subjectType
   * @param  {...any} terms
   * @returns {any}
   */
  and(subjectType, ...terms) {
    throw new NotImplementedError();
  }

  /**
   *
   * @param {string} subjectType
   * @param {any} condition
   * @returns {any}
   */
  negate(subjectType, condition) {
    throw new NotImplementedError();
  }
}

/**
 * @abstract
 */
class AbstractFilter {
  /**
   *
   * @param {boolean} negate
   */
  constructor(negate) {
    /**
     * @type {boolean}
     */
    this.negate = negate;
  }

  /**
   * @type {function}
   */
  getFilter = () => {
    throw new NotImplementedError();
  };
}

class LiteralFilter extends AbstractFilter {
  /**
   *
   * @param {boolean} negate
   * @param {boolean | any} filter
   */
  constructor(negate, filter) {
    super(negate);
    this.filter = filter;
  }

  getFilter = () => {
    return this.filter;
  };
}

class FunctionFilter extends AbstractFilter {
  /**
   *
   * @param {boolean} negate
   * @param {function} fn
   */
  constructor(negate, fn) {
    super(negate);
    this.fn = fn;
  }

  getFilter = (...args) => {
    return this.fn(...args);
  };
}
