var mission_tree = null;

function deleteMission(missionId) {
    var really = confirm("Really delete mission with id \"" + missionId + "\"");
    if (!really) return;
    var cmd = new DeleteMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", missionId);
    cmd.execute();
}

function addMission(parentId, type) {
    var id = prompt("Mission id");
    if(id == '' || id == null) return;

    // New Mission on the root layer:
    if(parentId == -1 || parentId == "-1") {
        cmd = new AddMissionCommand();
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("new_mission_id", id);
        cmd.setParameter("new_mission_type", type);
        cmd.execute();
    }
    else { // Add Submission
        cmd = new AddSubmissionCommand();
        cmd.setParameter("project_id", project_id);
        cmd.setParameter("mission_id", parentId);
        cmd.setParameter("submission_id", id);
        cmd.setParameter("submission_type", type);
        cmd.execute();
    }
}

function getNodeDataAsObject(node) {
    return eval(node.data("jstree"));
}

$(document).ready(function() {

$.jstree._themes = "/images/jstree/themes/";

  mission_tree = $("#missionTree").jstree({
    "plugins" : ["themes", "json_data","contextmenu","crrm"],
    "core"  : {
      "animation" : 100
    },
    "json_data" : {
        "ajax" : {
        "url" : "/ajax/show_missions",
        "data" : function(n) {
          var mission_id = -1;
          if(n.data) {
            var nodeData = eval (n.data("jstree"));
            mission_id = nodeData.mission_id;
          }
          return {"project_id" : project_id, "mission_id" : mission_id};
        }
        }
    },
    "contextmenu" : {
    "items" : function(n) {
      var nodeData = getNodeDataAsObject(n);
      var items = {
      "ccp" : false,
      "create" : false,
      "remove" : false,
      "rename" : {
          "label" : "Rename Mission",
          "action" : function(n) {$("#missionTree").jstree("rename",n)}
      },
      "delete" : {
        "label" : "Delete Mission",
        "action" : function(n) {deleteMission(getNodeDataAsObject(n).mission_id); }
      },
      "add_mission" : {
        "label" : "Add Mission",
        "submenu" : {
          "MapOverview" : {
            "label" : "MapOverview",
            "action" : function(n) { addMission(getNodeDataAsObject(n).mission_id, "MapOverview") }
          },
          "QuestionAndAnswer" : {
            "label" : "QuestionAndAnswer",
            "action" : function(n) { addMission(getNodeDataAsObject(n).mission_id, "QuestionAndAnswer") }
          },
          "NPCTalk" : {
            "label" : "NPCTalk",
            "action" : function(n) { addMission(getNodeDataAsObject(n).mission_id, "NPCTalk") }
          }

        }
      }
    }

    // Only allow submissions for these two types:
    if ((nodeData.type != "root") && (nodeData.type != "MapOverview")) {
      items.add_mission = false;
    }

    return items;
    }

    }

  });

  mission_tree.bind("rename_node.jstree", function (e, data) {
    var name = data.rslt.name;


    var missionToRenamedId = getNodeDataAsObject(data.args[0]).mission_id;

    var cmd = new RenameMissionCommand();
    cmd.setParameter("name", name);
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", missionToRenamedId);
    cmd.execute();
});


});