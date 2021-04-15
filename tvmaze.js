"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const DEFAULT_PHOTO = "https://tinyurl.com/tv-missing";
const BASE_URL = "http://api.tvmaze.com/"

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
// gets response from tvmaze and grabs the data necessary and returns an object of that data.
async function getShowsByTerm(term) {
  console.log('getShowsByTerm ran', this);

  let searchTerm = { params: { q: term } };
  let response = await axios.get(`${BASE_URL}search/shows`, searchTerm);
  console.log(response);

  // loops over array of show objects and grabs needed data
  let container = [];
  let showData = response.data;


  return showData.map(function (val) {
    let { id, name, summary, image } = val.show;
    val.show.image ? image = val.show.image.original : image = DEFAULT_PHOTO;
    return { id, name, summary, image };
  });

}


/** Given list of shows, create markup for each and add to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let { id, image, summary, name } of shows) {
    const $show = $(
      `<div data-show-id="${id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src= ${image}
              alt= ${name};
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${name}</h5>
             <div><small>${summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  console.log("getEpisodesOfShow Ran", this);
  let response = await axios.get(`${BASE_URL}shows/${id}/episodes`);
  console.log("response = ",response);

  let episodeData = response.data;

  return episodeData.map(function (val) {
    let { id, name, season, number } = val;
    return { id, name, season, number };

  });
}
/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $("#episodesArea").css("display", "block");
  for(let episode of episodes){
    let $li = $("<li>").text(`${episode.name} (season ${episode.season}, episode ${episode.number})`);
    $("#episodesList").append($li);
  };
}

$("#showsList").on("click", ".Show-getEpisodes", async function(evt){
  console.log("event handler episodes button ran", this);
  evt.preventDefault();
  let id = $(evt.target).closest(".Show").data("show-id");
  console.log("id =", id);
  let episodesArray = await getEpisodesOfShow(id);
  populateEpisodes(episodesArray);
})


//var customerId = $(this).closest("div[data-id]").attr('data-data-id');



/////////Old version of GetEpisodesOfShow loop
  // for (let currentShow of showData) {
  //   const { id, name, summary, image } = currentShow.show;
  //   // let id = currentShow.show.id;
  //   // let name = currentShow.show.name;
  //   // let summary = currentShow.show.summary;
  //   let image;
  //   if (!currentShow.show.image) {
  //     image = "https://tinyurl.com/tv-missing";
  //   } else {
  //     image = currentShow.show.image.original;
  //   }
  //   container.push({ id, name, summary, image });
  // }
  // return container
