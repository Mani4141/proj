    class Start extends Scene {
        create() {
            this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
            this.engine.storyState = {};
            this.engine.addChoice("Begin the story");
        }

        handleChoice() {
            this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
        }
    }

    class Location extends Scene {
        create(key) {
            let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
            this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
            
            if(this.engine.storyData.Locations[key].Choices.length>=1) { // TODO: check if the location has any Choices
                for(let choice of this.engine.storyData.Locations[key].Choices) { // TODO: loop over the location's Choices
                    if (!choice.Condition || this.engine.storyState[choice.Condition]) {
                    this.engine.addChoice(choice.Text,choice); // TODO: use the Text of the choice
                    }
                    // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
                }
            } else {
                this.engine.addChoice("The end.")
            }
        }

        handleChoice(choice) {
            if (choice) {
                this.engine.show("&gt; " + choice.Text);
    
                // Unlock key if choice gives something
                if (choice.Gives) {
                    this.engine.storyState[choice.Gives] = true;
                }
    
                if (choice.Target) {
                    const target = choice.Target;
                    const locationData = this.engine.storyData.Locations[target];
                    if (locationData.Mechanism === "glowingButton") {
                        this.engine.gotoScene(GlowingButton, target);
                    } else {
                        this.engine.gotoScene(Location, target);
                    }
                } else {
                    this.engine.gotoScene(End);
                }
            } else {
                this.engine.gotoScene(End);
            }
        }
    }

    class GlowingButton extends Location {
        create(key) {
            super.create(key); // Load the normal location data
    
            if (!this.engine.storyState["labUnlocked"]) {
                this.engine.addChoice("Press the glowing button", { special: "unlockLab" });
            } else {
                this.engine.addChoice("Enter the hidden lab", { Target: "HiddenLab" });
            }
        }
    
        handleChoice(choice) {
            if (choice.special === "unlockLab") {
                this.engine.show("> You press the button and hear a mechanical whir... A door slides open!");
                this.engine.storyState["labUnlocked"] = true;
                this.engine.gotoScene(GlowingButton, "Jack Baskin"); // Refresh current scene with updated choices
            } else if (choice.Target === "HiddenLab") {
                // Make sure to correctly transition to HiddenLab
                this.engine.gotoScene(Location, "HiddenLab");
            } else {
                super.handleChoice(choice); // Fallback to regular behavior
            }
        }
    }

    class End extends Scene {
        create() {
            this.engine.show("<hr>");
            this.engine.show(this.engine.storyData.Credits);
        }
    }


    Engine.load(Start, 'myStory.json');