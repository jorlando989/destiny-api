class User{
    constructor(accessToken){
        this.accessToken = accessToken;
        this.membershipType = 2;
        this.membershipId = accessToken.membership_id;
    }
}