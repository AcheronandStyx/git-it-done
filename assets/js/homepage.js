var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (user) {
    // format the github api url --- resposnive function takes
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        //  We can check if it was a successful request by using the ok property that's bundled in the response object from fetch()
        if (response.ok) { // if else for error handling on users that don't exsist
            response.json().then(function (data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    }).catch(function(error) {
        // notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to GitHub");
    });
};

var formSubmitHandler = function (event) {
    event.preventDefault();

    //When we submit the form, we get the value from the <input> element via the nameInputEl 
    // DOM variable and store the value in its own variable called username. Note the .trim() at the end: 
    // this piece is useful if we accidentally leave a leading or trailing space in the <input> element, such as " octocat" or "octocat ".
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }

    console.log(event);
};

var displayRepos = function (repos, searchTerm) {
    // check if api reutrned any repos.  If not say as much and return to main
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositoreis found.";
        return;
    }

    console.log(repos);
    console.log(searchTerm);

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    /*
    In the for loop, we're taking each repository (repos[i]) and writing some of its data to the page. 
    First we format the appearance of the name and repository name. 
    Next we create and style a <div> element. Then we create a <span> to hold the formatted repository name. 
    We add that to the <div> and add the entire <div> to the container we created earlier.
    */

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);