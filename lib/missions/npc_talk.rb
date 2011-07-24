require 'missions/mission'

class NPCTalk < Mission
  @properties = {
    "name" => "NPCTalk",
    "has_submissions" => false
  }

  def query_image_usage(adapter, image_path)
    template = ERB.new <<-EOF
    doc("game.xml")//mission[@type="NPCTalk"][@charImage="<%= image_path %>"]
EOF
    query = template.result(binding)
    results = adapter.do_request(query)
    usages = []
    results.each do |result|
      usages += [{
        "id" => result.attributes["id"],
        "name" => result.attributes["name"],
        "type" => "NPCTalk",
        "comment" => ""
      }]
    end
    return usages
  end
end