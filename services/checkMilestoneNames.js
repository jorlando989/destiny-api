//reference for when needing to check a milestones name

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const response = await fetch(
    "https://www.bungie.net/Platform/Destiny2/Milestones/",
    {
        headers: {
            "X-API-Key": keys.apiKey,
            Authorization: currentUser.accessToken.access_token,
        },
    }
);
if (response.status === 400 || response.status === 401) {
    return res
        .status(401)
        .send({ error: "error retrieving milestones" });
}
const resp = await response.json();
const milestones = resp.Response;

const manifest = new Manifest();
Object.values(milestones).forEach(m => {
    const milestoneData = manifest.getMilestoneInfo(m.milestoneHash);
    console.log(milestoneData.displayProperties.name, m.milestoneHash);
});