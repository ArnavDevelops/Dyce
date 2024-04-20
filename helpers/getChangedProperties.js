//Helps with the GuildUpdate event
module.exports.getChangedProperties = async function getChangedProperties(
  oldGuild,
  newGuild
) {
  function stringifyPropertyValue(value, key) {

    if (key === "defaultMessageNotifications") {
      if (value === 1) {
        return "Only Mentions";
      } else if (value === 0) {
        return "All Messages";
      }
    }

    if (key === "verificationLevel") {
      if (value === 1) {
        return "Low";
      } else if (value === 2) {
        return "Medium";
      } else if (value === 3) {
        return "High";
      } else if (value === 4) {
        return "Highest";
      }
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    } else {
      return value;
    }
  }

  const trackedProperties = {
    name: "Name",
    defaultMessageNotifications: "Default Message Notifications",
    icon: "Icon",
    verificationLevel: "Verification Level",
  };

  const changedProperties = [];
  for (const key in trackedProperties) {
    if (oldGuild[key] !== newGuild[key]) {
      let oldValue = stringifyPropertyValue(oldGuild[key], key);
      let newValue = stringifyPropertyValue(newGuild[key], key);
      if (key === "icon") {
        oldValue = oldValue ? `[Old Icon](https://cdn.discordapp.com/icons/${oldGuild.id}/${oldValue}.png)` : "";
        newValue = newValue ? `[New Icon](https://cdn.discordapp.com/icons/${newGuild.id}/${newValue}.png)` : "";
      }

      changedProperties.push({
        name: trackedProperties[key],
        oldValue,
        newValue,
      });
    }
  }

  return changedProperties;
};
