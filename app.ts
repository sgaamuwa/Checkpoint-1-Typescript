class Amity {

    //declare maps for the staff fellows livingspaces and offices in Amity
    staff: { [staffId: string] : Staff;} = {};
    fellows: { [staffId: string] : Fellow;} = {};
    livingspaces: { [roomName: string] : LivingSpace;} = {};
    offices: { [roomName: string] : Office;} = {};

    createRoom(name: string, roomId: string, roomType: string): string{
        //Check if the room exists in the system
        if(this.livingspaces[name] || this.offices[name]){
            return "this room name already exists";
        }
        //Create room if livingspace
        if (roomType == "livingspace"){
            this.livingspaces[name] = new LivingSpace(name, roomId);
            return "Room "+ name + " has been created"
        }
        //Create room if office
        else if (roomType == "office"){
            this.offices[name] = new Office(name, roomId);
            return "Room "+ name + " has been created"
        }
    }

    addPerson(firstName: string, lastName: string, staffId: string, staffType: string, accommodation: boolean = false): void {
        //Adding a staff member
        if (staffType == "staff"){
             let staffMember = new Staff(firstName, lastName, staffId);
             this.assignRoom(staffId, "office", staffMember);
             this.staff[staffId] = staffMember;
        }
        //Adding a fellow
        else if (staffType == "fellow"){
            let fellow = new Fellow(firstName, lastName, staffId);
            this.assignRoom(staffId, "office", fellow);
            //Assign them accommodation if requested
            if(accommodation == true){
                this.assignRoom(staffId, "livingspace", fellow);
            }
            this.fellows[staffId] = fellow;
        }
    }

    assignRoom(staffId: string, roomType: string, person: any ): void {
        var availableRooms: string[] = [];
        //Add available rooms to an array
        if (roomType == "office"){
            for (let room in this.offices){
                if (this.offices[room].occupants.length < 6){
                    availableRooms.push(this.offices[room].name)
                }
            }

        }
        else if(roomType == "livingspace"){
            for (let room in this.livingspaces){
                if (this.livingspaces[room].occupants.length < 4){
                    availableRooms.push(this.livingspaces[room].name)
                }
            }
        }
        //Randomise the room selection
        var randomRoom: string = availableRooms[Math.floor(Math.random() * availableRooms.length)];
        //Add them ot the room
        if(roomType == "office"){
            person.allocatedOffice = randomRoom;
            this.offices[randomRoom].occupants.push(person.staffId + " " + person.firstName + " " + person.lastName)
        }
        else if(roomType == "livingspace"){
            person.allocatedLivingspace = randomRoom;
            this.livingspaces[randomRoom].occupants.push(person.staffId + " " + person.firstName + " " + person.lastName)
        }

    }

    reallocatePerson(room: string, staffId: string): string {
        var person;
        var personType: string;
        //find the person in the maps
        if(this.fellows[staffId]){
            person = this.fellows[staffId]
        }
        else if(this.staff[staffId]){
            person = this.staff[staffId]
        }
        //if the room to reallocate to is an office
        if (this.offices[room]){
            //Check that the person is not already in that room 
            for(let person in this.offices[room].occupants){
                if(staffId == this.offices[room].occupants[person]){
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
            if(person instanceof Fellow){
                console.log("reaches here");
                this.fellows[staffId].allocatedOffice = room;
            }
            else if(person instanceof Staff){
                this.staff[staffId].allocatedOffice = room;
            }
        }
        //if the room to reallocate to is a livingspace and the person is a fellow
        else if (this.livingspaces[room] && person instanceof Fellow){
            for(let person in this.livingspaces[room].occupants){
                if(staffId == this.livingspaces[room].occupants[person]){
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
    }

    printAllocations(): void {
        //Text variables for the offices and Livingspaces
        var officeText: string = "";
        var livingspaceText: string = "";
        console.log("Offices");
        //Go through every office and add
        for(let office in this.offices){
            officeText = officeText + this.offices[office].name + "\n";
            officeText = officeText + "----------------------------------\n"
            for (let person in this.offices[office].occupants){
                officeText = officeText + this.offices[office].occupants[person] + ", ";
            }
            officeText = officeText + "\n"
        }
        console.log(officeText + "\n\n\n");
        console.log("LivingSpaces");
        for(let livingspace in this.livingspaces){
            livingspaceText = livingspaceText + this.livingspaces[livingspace].name + "\n";
            livingspaceText = livingspaceText + "------------------------------------\n"
            for (let person in this.livingspaces[livingspace].occupants){
                livingspaceText = livingspaceText + this.livingspaces[livingspace].occupants[person] + ", ";
            }
            livingspaceText = livingspaceText + "\n"
        }
        console.log(livingspaceText);
    }

    printUnallocated(): void {
        var noOffice: string = "";
        var noLivingspace: string = "";

        for (let person in this.staff){
            if(this.staff[person].allocatedOffice == null){
                noOffice = noOffice + this.staff[person].firstName + " " + this.staff[person].lastName + ", "
            }
        }
        for (let person in this.fellows){
            if(this.fellows[person].allocatedOffice == null){
                noOffice = noOffice + this.fellows[person].firstName + " " + this.fellows[person].lastName + ", "
            }
            else if(this.fellows[person].allocatedLivingspace == null){
                noLivingspace = noLivingspace + this.fellows[person].firstName + " " + this.fellows[person].lastName + ", "
            }
        }
        if(noOffice != ""){
            console.log("People not allocated Offices:");
            console.log(noOffice + "\n\n");
        }
        else{
            console.log("There are no people not allocated offices \n\n")
        }
        if(noLivingspace != ""){
            console.log("People not allocated Livingspaces:");
            console.log(noLivingspace);
        }
        else{
            console.log("There are no people not allocated Livingspaces")
        }
    }

    saveState(): void {

    }

    loadState(): void {

    }
}


class Room {

    occupants: string[];

    constructor(public name: string, public roomId: string){
        this.occupants = [];
    }

    printRoom(): void {
        var text: string = this.name + "\n";
        text = text + "------------------------------------------ \n";
        for (let person in this.occupants){
            text = text + this.occupants[person] + " ";
        }
        console.log(text);
    }
}



class Person { 

    allocatedOffice: string;

    constructor(public firstName: string, public lastName: string, public staffId: string){
        this.allocatedOffice = null;
    }

}



class Office extends Room {

}



class LivingSpace extends Room {

}



class Staff extends Person {

}



class Fellow extends Person {
    allocatedLivingspace: string;
    constructor(public firstName: string, public lastName: string, public staffId: string){
        super(firstName, lastName, staffId)
        this.allocatedLivingspace = null;
    }
}




var amity = new Amity();
amity.createRoom("Python", "LS-01", "livingspace");
amity.createRoom("Valhala", "OF-02", "office");
amity.addPerson("samuel", "gaamuwa", "ST-01", "staff");
amity.addPerson("michael", "senfuma", "FL-02", "fellow")
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
