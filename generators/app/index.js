let path = require("path");
let Generator = require("yeoman-generator");

let Project = require("./cli/project");

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		let actionAvailable = ["generate"];

		this.argument("action", {type: String, required: true});
		this.argument("parameter", {
			type: String,
			required: false,
			default: () => {
				if(this.options["action"] == "generate")
					return path.basename(process.cwd());
			}
		});
	}

	initializing() {
		let defaultProjectName = this.options["parameter"];

		this.project = new Project(defaultProjectName);
	}

	async prompting() {
		let promptSettings = [].concat(
			this.project.prompt(),
		);
		this.answers = await this.prompt(promptSettings);
	}

	configuring() {
    	let answerEnabledName = this.answers.project_name;
    	this.project.configure(answerEnabledName);
	}

	writing() {
		this.fs.copyTpl(
			this.templatePath("CMakeLists.txt"),
			this.destinationPath("CMakeLists.txt"),
			{projectName: this.project.name}
		);
		this.fs.copyTpl(
			this.templatePath("test/Test.cpp"),
			this.destinationPath(`test/${this.project.name}Test.cpp`),
			{projectName: this.project.name}
		);
		this.fs.copyTpl(
			this.templatePath("src/ProjectClass.cpp"),
			this.destinationPath(`src/${this.project.name}.cpp`),
			{projectName: this.project.name}
		);
		this.fs.copyTpl(
			this.templatePath("src/ProjectClass.h"),
			this.destinationPath(`src/${this.project.name}.h`),
			{
			 projectName: this.project.name,
			 projectUpperSnakeCase: this.project.name.replace(/([A-Z]+)/g, "_$1")
			 										 .replace(/^_/g, "")
			 										 .toUpperCase()
			}
		);
	}

	install() {
    	this.spawnCommandSync('git', ['clone', 'https://github.com/google/googletest.git']);
    	this.spawnCommandSync('rm', ['-rf', 'googletest/.git']);    	
	}

	end() {
    	this.log("Your project is ready to use!!");
	}
};