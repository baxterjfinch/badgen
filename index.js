function load_lib(lib){
	if(lib){
		return require(lib)
	}else{
		return require('./avatar_lib.json')
	}
}

function legend_lib(){
	return require('./1_legendary_lib.json')
}

function epic_lib(){
	return require('./2_epic_lib.json')
}

function exotic_lib(){
	return require('./3_exotic_lib.json')
}

function rare_lib(){
	return require('./4_rare_lib.json')
}

function common_lib(){
	return require('./5_common_lib.json')
}

var avatar_lib = load_lib()
var _legendary_lib = legend_lib()
var _epic_lib = epic_lib()
var _exotic_lib = exotic_lib()
var _rare_lib = rare_lib()
var _common_lib = common_lib()

function generate_avatar(avatar) {
    var svg = ""
    for (var part in avatar) {
			if (part === "background") {
				svg += avatar[part].pattern
			} else {
				svg += avatar_lib[part].pattern[avatar[part].pattern]
				svg = svg.replace(/{{color}}/g,avatar_lib[part].colors[avatar[part].colors])
			}
    }
    return svg
}

function from_hash(hash, type) {
	var avatar_hashed = {}
	avatar_hashed["background"] = {}

	switch(type) {
		case 1:
			avatar_hashed["background"].pattern = _legendary_lib["background"].pattern[0]
			break;
		case 2:
			avatar_hashed["background"].pattern = _epic_lib["background"].pattern[0]
			break;
		case 3:
			avatar_hashed["background"].pattern = _exotic_lib["background"].pattern[0]
			break;
		case 4:
			avatar_hashed["background"].pattern = _rare_lib["background"].pattern[0]
			break;
		case 5:
			avatar_hashed["background"].pattern = _common_lib["background"].pattern[0]
			break;
	}
  for (var part in avatar_lib) {
    avatar_hashed[part] = {}
    avatar_hashed[part].pattern = Math.floor(Math.random()*avatar_lib[part].pattern.length)
    avatar_hashed[part].colors = Math.floor(Math.random()*avatar_lib[part].colors.length)
  }
	// avatar_rand.eye.colors = avatar_rand.mouth.colors
	return avatar_hashed
}

function random(){
	var avatar_rand = {}
  for (var part in avatar_lib) {
    avatar_rand[part] = {}
    avatar_rand[part].pattern = Math.floor(Math.random()*avatar_lib[part].pattern.length)
    avatar_rand[part].colors = Math.floor(Math.random()*avatar_lib[part].colors.length)
  }
	// avatar_rand.eye.colors = avatar_rand.mouth.colors
	return avatar_rand
}


function change_avatar(avatar, part, change, direction) {
  if (direction == 'next') {
    if (change == 'color') {

      for (var p in avatar_lib) {
        if (p == part){
          if(avatar[p].colors + 1 < avatar_lib[p].colors.length){
        			avatar[p].colors += 1
        		}else{
        			avatar[p].colors = 0
        		}
        }
      }
      return avatar

    }else if (change == 'pattern'){

      for (var p in avatar_lib) {
        if (p == part){
          if(avatar[p].pattern + 1 < avatar_lib[p].pattern.length){
              avatar[p].pattern += 1
            }else{
              avatar[p].pattern = 0
            }
        }
      }
      return avatar

    }
  }else if (direction == 'previous'){
    if (change == 'color') {

      for (var p in avatar_lib) {
        if (p == part){
          if(avatar[p].colors == 0){
        			avatar[p].colors = avatar_lib[p].colors.length - 1
        		}else{
        			avatar[p].colors -= 1
        		}
        }
      }
      return avatar

    }else if (change == 'pattern'){

      for (var p in avatar_lib) {
        if (p == part){
          if(avatar[p].pattern == 0){
        			avatar[p].pattern = avatar_lib[p].pattern.length - 1
        		}else{
        			avatar[p].pattern -= 1
        		}
        }
      }
      return avatar

    }
  }
	return {"error": true, "msg": "Something goes wrong" }
}

function parse_avatar(avatar){
	if( typeof avatar == 'string'){
    	avatar_parsed = JSON.parse(avatar)
    }else{
    	avatar_parsed = avatar
    }
    return avatar_parsed
}

function avatar_to_string(avatar){
    avatar_parsed = JSON.stringify(avatar)
    return avatar_parsed
}

function is_valid_avatar(avatar){
			for (var part in avatar_lib) {
				if(avatar[part] != undefined){
					if(avatar[part].pattern == undefined || avatar[part].colors == undefined) return false
				}else {
					return false
				}
			}
			return true
}

function is_valid_part(part){
	for (var p in avatar_lib) {
		if(part == p) return true
	}
  return false
}

function is_valid_direction(direction){
	if(direction == "next" || direction == "previous"){
		return true
	}else {
		return false
	}
}

function is_valid_change(change){
	if(change == "color" || change == "pattern"){
		return true
	}else {
		return false
	}
}

module.exports = {
		from_hash_id: function (hash, type) {
			return from_hash(hash, type)
		},

    lib_json: function() {
        return avatar_lib
    },

    stringify_avatar: function(avatar_json){

    	if(!is_valid_avatar(avatar_json)) return {'error': true, 'msg':'unvalid avatar'}

    	return avatar_to_string(avatar_json)
    },

    render_svg: function(avatar){
    	avatar_parsed = parse_avatar(avatar)

    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

    	return generate_avatar(avatar_parsed)
    },

    random_avatar: function() {
        return random()
    },

    render_random_svg: function() {
        return generate_avatar(random())
    },

    modify_avatar: function(avatar,part,change,direction) {
      avatar_parsed = parse_avatar(avatar)

			if(!is_valid_change(change)) return {'error': true, 'msg':'unvalid argument, for "color" or "pattern" '}
			if(!is_valid_direction(direction)) return {'error': true, 'msg':'unvalid argument, for direction ("next" or "previous") '}
			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
      if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

      return change_avatar(avatar_parsed,part,change,direction)
    },

		modify_avatar_svg: function(avatar,part,color,direction) {
      avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
      if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

        return generate_avatar(change_avatar(avatar_parsed,part,color,direction))
    },

    next_pattern_avatar: function(avatar,part) {
    	avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

        return change_avatar(avatar_parsed,part,'pattern','next')
    },
    next_pattern_svg: function(avatar,part) {
    	avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

      return generate_avatar(change_avatar(avatar_parsed,part,'pattern','next'))
    },
    next_color_avatar: function(avatar,part) {
    	avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

        return change_avatar(avatar_parsed,part,'color','next')
    },
    next_color_svg: function(avatar,part) {
    	avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

      return generate_avatar(change_avatar(avatar_parsed,part,'color','next'))
    },

    previous_pattern_avatar: function(avatar,part) {
    	avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

        return change_avatar(avatar_parsed,part,'pattern','previous')
    },
    previous_pattern_svg: function(avatar,part) {
    	avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

        return generate_avatar(change_avatar(avatar_parsed,part,'pattern','previous'))
    },

    previous_color_avatar: function(avatar,part) {
    	avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

        return change_avatar(avatar_parsed,part,'color','previous')
    },
    previous_color_svg: function(avatar,part) {
    	avatar_parsed = parse_avatar(avatar)

			if(!is_valid_part(part)) return {'error': true, 'msg':'unvalid part'}
    	if(!is_valid_avatar(avatar_parsed)) return {'error': true, 'msg':'unvalid avatar'}

        return generate_avatar(change_avatar(avatar_parsed,part,'color','previous'))
    }

}
