const fs = require('fs');

const rawPolls = fs.readFileSync('./source/polls.json');
const polls = JSON.parse(rawPolls);

const rawDeputies = fs.readFileSync('./source/deputies.json');
const deputies = JSON.parse(rawDeputies);

const merged = polls.map(poll => {
  let votes = poll.votes.deputies;
  
  votes = votes.map(({webId, vote}) => {
    const dep = deputies.find(dep => dep.webId === webId);
    
    if(!dep) {
      return {
        name: 'Name nicht verfügbar',
        constituency: 'Wahlkreis nicht verfügbar',
        vote
      };
    }
    
    return {
      name: dep.name,
      party: dep.party,
      image: dep.imgURL,
      constituency: dep.constituencyName,
      vote: vote
    };
  });
  
  return {
    title: poll.title,
    date: poll.date,
    votes: votes,
  };
});

const indexJSON = merged.map((poll, index) => {
  return {
    id: index,
    title: poll.title,
    date: poll.date,
  };
});

fs.writeFileSync('./export/index.json', JSON.stringify(indexJSON));

merged.forEach((poll, index) => {
  fs.writeFileSync(`./export/polls/${ index }.json`, JSON.stringify(poll));
});