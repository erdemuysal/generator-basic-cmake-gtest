module.exports = class Project {
  constructor(name) {
    this.name = name;
  }

  configure(name) {
    this.name = name;
  }

  validateName(name) {
    let pass = name.match(/\s/);
    if (pass) {
      return "A project name cannot contains spaces";
    }
    return true;
  }

  prompt() {
    return [this._promptName()];
  }

  _promptName() {
    return {
      type: "input",
      name: "project_name",
      message: `What is the name of your project?`,
      validate: input => this.validateName(input),
      default: this.name
    };
  }
};