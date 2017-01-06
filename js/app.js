var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Amity = (function () {
    function Amity() {
        //declare maps for the staff fellows livingspaces and offices in Amity
        this.staff = {};
        this.fellows = {};
        this.livingspaces = {};
        this.offices = {};
    }
    Amity.prototype.createRoom = function (name, roomId, roomType) {
        //Check if the room exists in the system
        if (this.livingspaces[name] || this.offices[name]) {
            return "this room name already exists";
        }
        //Create room if livingspace
        if (roomType == "livingspace") {
            this.livingspaces[name] = new LivingSpace(name, roomId);
            return "Room " + name + " has been created";
        }
        else if (roomType == "office") {
            this.offices[name] = new Office(name, roomId);
            return "Room " + name + " has been created";
        }
    };
    Amity.prototype.addPerson = function (firstName, lastName, staffId, staffType, accommodation) {
        if (accommodation === void 0) { accommodation = false; }
        //Adding a staff member
        if (staffType == "staff") {
            var staffMember = new Staff(firstName, lastName, staffId);
            this.assignRoom(staffId, "office", staffMember);
            this.staff[staffId] = staffMember;
        }
        else if (staffType == "fellow") {
            var fellow = new Fellow(firstName, lastName, staffId);
            this.assignRoom(staffId, "office", fellow);
            //Assign them accommodation if requested
            if (accommodation == true) {
                this.assignRoom(staffId, "livingspace", fellow);
            }
            this.fellows[staffId] = fellow;
        }
    };
    Amity.prototype.assignRoom = function (staffId, roomType, person) {
        var availableRooms = [];
        //Add available rooms to an array
        if (roomType == "office") {
            for (var room in this.offices) {
                if (this.offices[room].occupants.length < 6) {
                    availableRooms.push(this.offices[room].name);
                }
            }
        }
        else if (roomType == "livingspace") {
            for (var room in this.livingspaces) {
                if (this.livingspaces[room].occupants.length < 4) {
                    availableRooms.push(this.livingspaces[room].name);
                }
            }
        }
        //Randomise the room selection
        var randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
        //Add them ot the room
        if (roomType == "office") {
            person.allocatedOffice = randomRoom;
            this.offices[randomRoom].occupants.push(person.staffId + " " + person.firstName + " " + person.lastName);
        }
        else if (roomType == "livingspace") {
            person.allocatedLivingspace = randomRoom;
            this.livingspaces[randomRoom].occupants.push(person.staffId + " " + person.firstName + " " + person.lastName);
        }
    };
    Amity.prototype.reallocatePerson = function (room, staffId) {
        var person;
        var personType;
        //find the person in the maps
        if (this.fellows[staffId]) {
            person = this.fellows[staffId];
        }
        else if (this.staff[staffId]) {
            person = this.staff[staffId];
        }
        //if the room to reallocate to is an office
        if (this.offices[room]) {
            //Check that the person is not already in that room 
            for (var person_1 in this.offices[room].occupants) {
                if (staffId == this.offices[room].occupants[person_1]) {
                    return "Person is already in the room";
                }
            }
            //Remove the person from the room that they were in 
            var index = this.offices[person.allocatedOffice].occupants.indexOf(person.staffId + " " + person.firstName + " " + person.lastName, 0);
            if (index > -1) {
                this.offices[person.allocatedOffice].occupants.splice(index, 1);
            }
            //Add person to the new room
            this.offices[room].occupants.push(person.staffId + " " + person.firstName + " " + person.lastName);
            //Change the room of the person
            if (person instanceof Fellow) {
                console.log("reaches here");
                this.fellows[staffId].allocatedOffice = room;
            }
            else if (person instanceof Staff) {
                this.staff[staffId].allocatedOffice = room;
            }
        }
        else if (this.livingspaces[room] && person instanceof Fellow) {
            for (var person_2 in this.livingspaces[room].occupants) {
                if (staffId == this.livingspaces[room].occupants[person_2]) {
                    return "Person is already in the room";
                }
            }
            //Remove the person from the room that they were in 
            var index = this.livingspaces[person.allocatedLivingspace].occupants.indexOf(person.staffId + " " + person.firstName + " " + person.lastName, 0);
            if (index > -1) {
                this.livingspaces[person.allocatedLivingspace].occupants.splice(index, 1);
            }
            //Add person to new room
            this.livingspaces[room].occupants.push(person.staffId + " " + person.firstName + " " + person.lastName);
            //Change the room of the person
            this.fellows[staffId].allocatedLivingspace = room;
        }
        else {
            return "This room does not exist";
        }
    };
    Amity.prototype.printAllocations = function () {
        //Text variables for the offices and Livingspaces
        var officeText = "";
        var livingspaceText = "";
        console.log("Offices");
        //Go through every office and add
        for (var office in this.offices) {
            officeText = officeText + this.offices[office].name + "\n";
            officeText = officeText + "----------------------------------\n";
            for (var person in this.offices[office].occupants) {
                officeText = officeText + this.offices[office].occupants[person] + ", ";
            }
            officeText = officeText + "\n";
        }
        console.log(officeText + "\n\n\n");
        console.log("LivingSpaces");
        for (var livingspace in this.livingspaces) {
            livingspaceText = livingspaceText + this.livingspaces[livingspace].name + "\n";
            livingspaceText = livingspaceText + "------------------------------------\n";
            for (var person in this.livingspaces[livingspace].occupants) {
                livingspaceText = livingspaceText + this.livingspaces[livingspace].occupants[person] + ", ";
            }
            livingspaceText = livingspaceText + "\n";
        }
        console.log(livingspaceText);
    };
    Amity.prototype.printUnallocated = function () {
        var noOffice = "";
        var noLivingspace = "";
        for (var person in this.staff) {
            if (this.staff[person].allocatedOffice == null) {
                noOffice = noOffice + this.staff[person].firstName + " " + this.staff[person].lastName + ", ";
            }
        }
        for (var person in this.fellows) {
            if (this.fellows[person].allocatedOffice == null) {
                noOffice = noOffice + this.fellows[person].firstName + " " + this.fellows[person].lastName + ", ";
            }
            else if (this.fellows[person].allocatedLivingspace == null) {
                noLivingspace = noLivingspace + this.fellows[person].firstName + " " + this.fellows[person].lastName + ", ";
            }
        }
        if (noOffice != "") {
            console.log("People not allocated Offices:");
            console.log(noOffice + "\n\n");
        }
        else {
            console.log("There are no people not allocated offices \n\n");
        }
        if (noLivingspace != "") {
            console.log("People not allocated Livingspaces:");
            console.log(noLivingspace);
        }
        else {
            console.log("There are no people not allocated Livingspaces");
        }
    };
    Amity.prototype.saveState = function () {
    };
    Amity.prototype.loadState = function () {
    };
    return Amity;
}());
var Room = (function () {
    function Room(name, roomId) {
        this.name = name;
        this.roomId = roomId;
        this.occupants = [];
    }
    Room.prototype.printRoom = function () {
        var text = this.name + "\n";
        text = text + "------------------------------------------ \n";
        for (var person in this.occupants) {
            text = text + this.occupants[person] + " ";
        }
        console.log(text);
    };
    return Room;
}());
var Person = (function () {
    function Person(firstName, lastName, staffId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.staffId = staffId;
        this.allocatedOffice = null;
    }
    return Person;
}());
var Office = (function (_super) {
    __extends(Office, _super);
    function Office() {
        return _super.apply(this, arguments) || this;
    }
    return Office;
}(Room));
var LivingSpace = (function (_super) {
    __extends(LivingSpace, _super);
    function LivingSpace() {
        return _super.apply(this, arguments) || this;
    }
    return LivingSpace;
}(Room));
var Staff = (function (_super) {
    __extends(Staff, _super);
    function Staff() {
        return _super.apply(this, arguments) || this;
    }
    return Staff;
}(Person));
var Fellow = (function (_super) {
    __extends(Fellow, _super);
    function Fellow(firstName, lastName, staffId) {
        var _this = _super.call(this, firstName, lastName, staffId) || this;
        _this.firstName = firstName;
        _this.lastName = lastName;
        _this.staffId = staffId;
        _this.allocatedLivingspace = null;
        return _this;
    }
    return Fellow;
}(Person));
var amity = new Amity();
amity.createRoom("Python", "LS-01", "livingspace");
amity.createRoom("Valhala", "OF-02", "office");
amity.addPerson("samuel", "gaamuwa", "ST-01", "staff");
amity.addPerson("michael", "senfuma", "FL-02", "fellow");
amity.addPerson("mark", "kawanguzi", "FL-01", "fellow", true);
amity.printUnallocated();
amity.offices["Valhala"].printRoom();
amity.createRoom("Krypton", "OF-01", "office");
amity.createRoom("Ruby", "LS-02", "livingspace");
console.log("original");
console.log(amity.offices["Valhala"].occupants);
console.log(amity.livingspaces["Python"].occupants);
amity.reallocatePerson("Krypton", "ST-01");
amity.reallocatePerson("Ruby", "FL-01");
console.log(amity.fellows["FL-01"].allocatedLivingspace);
console.log(amity.staff["ST-01"].allocatedOffice);
console.log("current");
console.log(amity.offices["Valhala"].occupants);
console.log(amity.livingspaces["Python"].occupants);
console.log("new rooms");
console.log(amity.offices["Krypton"].occupants);
console.log(amity.livingspaces["Ruby"].occupants);
//# sourceMappingURL=app.js.map