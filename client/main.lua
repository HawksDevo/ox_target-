if not lib.checkDependency('ox_lib', '3.0.0', true) then return end

lib.locale()

local utils = require 'client.utils'
local state = require 'client.state'
local options = require 'client.api'.getTargetOptions()

require 'client.debug'
require 'client.compat.rsg-target'

local SendNuiMessage = SendNuiMessage
local GetEntityCoords = GetEntityCoords
local GetEntityType = GetEntityType
local HasEntityClearLosToEntity = HasEntityClearLosToEntity
local GetEntityModel = GetEntityModel
local IsDisabledControlJustPressed = IsDisabledControlJustPressed
local DisableControlAction = DisableControlAction
local DisablePlayerFiring = DisablePlayerFiring
local GetModelDimensions = GetModelDimensions
local GetOffsetFromEntityInWorldCoords = GetOffsetFromEntityInWorldCoords
local currentTarget = {}
local currentMenu
local menuChanged
local menuHistory = {}
local nearbyZones

-- Toggle ox_target, instead of holding the hotkey
local toggleHotkey = GetConvarInt('ox_target:toggleHotkey', 0) == 1
local mouseButton = GetConvarInt('ox_target:leftClick', 1) == 1 and 24 or 25
local targetHotkey = 0x8AAA0AD4
local debug = GetConvarInt('ox_target:debug', 0) == 1
local vec0 = vec3(0, 0, 0)

local appearanceKvpKey = 'ox_target:appearance:v1'
local appearanceCommand = GetConvar('ox_target:appearanceCommand', 'ox')
local appearanceOpen = false
local defaultCustomLayouts = {
    ['1'] = { { x = 0, y = -70 } },
    ['2'] = { { x = -82, y = 0 }, { x = 82, y = 0 } },
    ['3'] = { { x = -82, y = 52 }, { x = 0, y = -74 }, { x = 82, y = 52 } },
    ['4'] = { { x = 0, y = -82 }, { x = 0, y = 82 }, { x = -102, y = 0 }, { x = 102, y = 0 } },
    ['5'] = { { x = 0, y = -96 }, { x = 91, y = -30 }, { x = 56, y = 78 }, { x = -56, y = 78 }, { x = -91, y = -30 } },
    ['6'] = { { x = 0, y = -102 }, { x = 88, y = -51 }, { x = 88, y = 51 }, { x = 0, y = 102 }, { x = -88, y = 51 }, { x = -88, y = -51 } },
}
local defaultPreviewLabels = { 'Meni', 'Skladište', 'Smjena', 'Pregledaj', 'Razgovaraj', 'Posebna radnja' }

local defaultAppearance = {
    settingsVersion = 2,
    language = 'en',
    iconMode = 'preset',
    icon = 'fa-eye',
    customIcon = 'fa-solid fa-hat-cowboy',
    imageUrl = '',
    imageSize = 24,
    imageRound = false,
    tabShape = 'rounded',
    layout = 'glass',
    arrangement = 'list',
    radialRadius = 95,
    previewCount = 3,
    previewSet = 'interactions',
    previewLabels = defaultPreviewLabels,
    customLayouts = defaultCustomLayouts,
    accentColor = '#d7b24a',
    secondaryColor = '#5cc8ff',
    textColor = '#f8f7f3',
    backgroundColor = '#121418',
    position = 'right',
    borderWidth = 1,
    radius = 10,
    menuWidth = 220,
    scale = 100,
    rowHeight = 42,
    opacity = 88,
    glow = true,
    animations = true,
    animationStyle = 'pulse',
    animationSpeed = 100,
    dualColor = false,
    colorAnimation = 'smooth',
    showNumbers = false,
}

local allowedIcons = {
    ['fa-eye'] = true,
    ['fa-crosshairs'] = true,
    ['fa-bullseye'] = true,
    ['fa-hand-pointer'] = true,
    ['fa-location-crosshairs'] = true,
    ['fa-compass'] = true,
    ['fa-hat-cowboy'] = true,
    ['fa-star'] = true,
    ['fa-skull'] = true,
}

local allowedIconModes = { preset = true, custom = true, image = true }
local allowedLanguages = { hr = true, en = true, de = true }
local allowedTabShapes = { rounded = true, pill = true, compact = true, sharp = true, split = true, floating = true, ticket = true, angled = true, double = true, soft = true, stripe = true, badge = true }
local allowedLayouts = { glass = true, solid = true, minimal = true, neon = true, outline = true, western = true, frost = true, carbon = true, gold = true, crimson = true, ghost = true, terminal = true }
local allowedArrangements = { list = true, cross = true, circle = true, arc = true, fan = true, zigzag = true, custom = true }
local allowedPreviewSets = { interactions = true, work = true, vehicle = true, storage = true, custom = true }
local allowedPositions = { right = true, left = true, below = true }
local allowedAnimations = { pulse = true, breathe = true, spin = true, bounce = true, wiggle = true, flip = true, orbit = true, none = true }
local allowedColorAnimations = { smooth = true, snap = true, flow = true, wave = true, glow = true, border = true }

local function clampNumber(value, minimum, maximum, fallback)
    value = tonumber(value)

    if not value then return fallback end

    value = math.floor(value + 0.5)
    return math.min(maximum, math.max(minimum, value))
end

local function validHex(value, fallback)
    return type(value) == 'string' and value:match('^#%x%x%x%x%x%x$') and value:lower() or fallback
end

local function validBoolean(value, fallback)
    if type(value) == 'boolean' then return value end
    return fallback
end

local function validIconClass(value)
    if type(value) ~= 'string' or #value > 80 then return defaultAppearance.customIcon end

    value = value:match('^%s*(.-)%s*$')

    if value == '' or not value:match('^[%w%s%-]+$') or not value:match('fa%-[%w%-]+') then
        return defaultAppearance.customIcon
    end

    return value
end


local function validImageUrl(value)
    if type(value) ~= 'string' or #value > 500 then return '' end

    value = value:match('^%s*(.-)%s*$')
    return value:match('^https://') and value or ''
end

local function sanitizeCustomLayouts(value)
    value = type(value) == 'table' and value or {}
    local layouts = {}

    for count = 1, 6 do
        local key = tostring(count)
        local fallback = defaultCustomLayouts[key]
        local source = type(value[key]) == 'table' and value[key] or type(value[count]) == 'table' and value[count] or fallback
        local output = {}

        for index = 1, count do
            local point = type(source[index]) == 'table' and source[index] or fallback[index]
            output[index] = {
                x = clampNumber(point.x, -260, 260, fallback[index].x),
                y = clampNumber(point.y, -240, 240, fallback[index].y),
            }
        end

        layouts[key] = output
    end

    return layouts
end

local function sanitizePreviewLabels(value)
    if type(value) ~= 'table' then return defaultPreviewLabels end

    local labels = {}

    for index = 1, math.min(6, #value) do
        if type(value[index]) == 'string' then
            local label = value[index]:gsub('[%c]', ''):match('^%s*(.-)%s*$'):sub(1, 64)
            if label ~= '' then labels[#labels + 1] = label end
        end
    end

    return labels
end

local function sanitizeAppearance(data)
    data = type(data) == 'table' and data or {}
    local radialRadius = clampNumber(data.radialRadius, 45, 200, defaultAppearance.radialRadius)

    if data.settingsVersion == nil and radialRadius == 150 then
        radialRadius = defaultAppearance.radialRadius
    end

    return {
        settingsVersion = defaultAppearance.settingsVersion,
        language = allowedLanguages[data.language] and data.language or defaultAppearance.language,
        iconMode = allowedIconModes[data.iconMode] and data.iconMode or defaultAppearance.iconMode,
        icon = allowedIcons[data.icon] and data.icon or defaultAppearance.icon,
        customIcon = validIconClass(data.customIcon),
        imageUrl = validImageUrl(data.imageUrl),
        imageSize = clampNumber(data.imageSize, 14, 48, defaultAppearance.imageSize),
        imageRound = validBoolean(data.imageRound, defaultAppearance.imageRound),
        tabShape = allowedTabShapes[data.tabShape] and data.tabShape or defaultAppearance.tabShape,
        layout = allowedLayouts[data.layout] and data.layout or defaultAppearance.layout,
        arrangement = allowedArrangements[data.arrangement] and data.arrangement or defaultAppearance.arrangement,
        radialRadius = radialRadius,
        previewCount = clampNumber(data.previewCount, 1, 6, defaultAppearance.previewCount),
        previewSet = allowedPreviewSets[data.previewSet] and data.previewSet or defaultAppearance.previewSet,
        previewLabels = sanitizePreviewLabels(data.previewLabels),
        customLayouts = sanitizeCustomLayouts(data.customLayouts),
        accentColor = validHex(data.accentColor, defaultAppearance.accentColor),
        secondaryColor = validHex(data.secondaryColor, defaultAppearance.secondaryColor),
        textColor = validHex(data.textColor, defaultAppearance.textColor),
        backgroundColor = validHex(data.backgroundColor, defaultAppearance.backgroundColor),
        position = allowedPositions[data.position] and data.position or defaultAppearance.position,
        borderWidth = clampNumber(data.borderWidth, 0, 4, defaultAppearance.borderWidth),
        radius = clampNumber(data.radius, 0, 22, defaultAppearance.radius),
        menuWidth = clampNumber(data.menuWidth, 180, 340, defaultAppearance.menuWidth),
        scale = clampNumber(data.scale, 80, 125, defaultAppearance.scale),
        rowHeight = clampNumber(data.rowHeight, 34, 58, defaultAppearance.rowHeight),
        opacity = clampNumber(data.opacity, 20, 100, defaultAppearance.opacity),
        glow = validBoolean(data.glow, defaultAppearance.glow),
        animations = validBoolean(data.animations, defaultAppearance.animations),
        animationStyle = allowedAnimations[data.animationStyle] and data.animationStyle or defaultAppearance.animationStyle,
        animationSpeed = clampNumber(data.animationSpeed, 50, 200, defaultAppearance.animationSpeed),
        dualColor = validBoolean(data.dualColor, defaultAppearance.dualColor),
        colorAnimation = allowedColorAnimations[data.colorAnimation] and data.colorAnimation or defaultAppearance.colorAnimation,
        showNumbers = validBoolean(data.showNumbers, defaultAppearance.showNumbers),
    }
end

local function loadAppearance()
    local stored = GetResourceKvpString(appearanceKvpKey)

    if not stored then return sanitizeAppearance(defaultAppearance), false end

    local success, decoded = pcall(json.decode, stored)
    if not success or type(decoded) ~= 'table' then
        return sanitizeAppearance(defaultAppearance), false
    end

    return sanitizeAppearance(decoded), true
end

local appearance, hasPersonalAppearance = loadAppearance()
local serverAppearanceLoaded = hasPersonalAppearance

CreateThread(function()
    if hasPersonalAppearance then return end

    local success, serverSettings = pcall(lib.callback.await, 'ox_target:getServerAppearance', false)

    if success and type(serverSettings) == 'table' and not hasPersonalAppearance then
        appearance = sanitizeAppearance(serverSettings)
        SendNuiMessage(json.encode({ event = 'applyAppearance', settings = appearance }))
    end

    serverAppearanceLoaded = true
end)

local function waitForServerAppearance()
    local timeout = GetGameTimer() + 2500
    while not serverAppearanceLoaded and GetGameTimer() < timeout do Wait(0) end
end

local function isAppearanceAdmin()
    local success, allowed = pcall(lib.callback.await, 'ox_target:isAppearanceAdmin', false)
    return success and allowed == true
end

local function closeAppearance(sendMessage)
    if not appearanceOpen then return end

    appearanceOpen = false
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)

    if sendMessage then
        SendNuiMessage('{"event":"closeAppearance"}')
    end
end

local function openAppearance()
    if appearanceOpen then
        closeAppearance(true)
        return
    end

    if state.isActive() then
        state.setActive(false)
        Wait(150)
    elseif IsNuiFocused() then
        lib.notify({ description = 'Zatvori trenutni izbornik prije otvaranja ox_target postavki.', type = 'error' })
        return
    end

    waitForServerAppearance()

    appearanceOpen = true
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(false)
    SendNuiMessage(json.encode({ event = 'openAppearance', settings = appearance, isAdmin = isAppearanceAdmin() }))
end

local function isPauseMenuOrMapActive()
    return IsPauseMenuActive() or IsAppActive(`MAP`) ~= 0
end

---@param option OxTargetOption
---@param distance number
---@param endCoords vector3
---@param entityHit? number
---@param entityType? number
---@param entityModel? number | false
local function shouldHide(option, distance, endCoords, entityHit, entityType, entityModel)
    if option.menuName ~= currentMenu then
        return true
    end

    if distance > (option.distance or 7) then
        return true
    end

    if option.groups and not utils.hasPlayerGotGroup(option.groups) then
        return true
    end

    if option.items and not utils.hasPlayerGotItems(option.items, option.anyItem) then
        return true
    end

    local offset = entityModel and option.offset or nil

    if offset then
        ---@cast entityHit number
        ---@cast entityType number
        ---@cast entityModel number

        if not option.absoluteOffset then
            local min, max = GetModelDimensions(entityModel)
            offset = (max - min) * offset + min
        end

        offset = GetOffsetFromEntityInWorldCoords(entityHit, offset.x, offset.y, offset.z)

        if #(endCoords - offset) > (option.offsetSize or 1) then
            return true
        end
    end

    if option.canInteract then
        local success, resp = pcall(option.canInteract, entityHit, distance, endCoords, option.name, bone)
        return not success or not resp
    end
end


local function stopTargeting()
    state.setNuiFocus(false, false)
    state.setActive(false)
end

local function startTargeting()
    if state.isDisabled() or state.isActive() or IsNuiFocused() or isPauseMenuOrMapActive() then return end

    state.setActive(true)

    local flag = 30
    local hit, entityHit, endCoords, distance, lastEntity, entityType, entityModel, hasTick, hasTarget, zonesChanged
    local zones = {}

    CreateThread(function()
        local dict, texture = utils.getTexture()
        local lastCoords

        while state.isActive() do

            lastCoords = endCoords == vec0 and lastCoords or endCoords or vec0
        
            utils.drawZoneSprites(dict, texture)
            DisablePlayerFiring(cache.playerId, true)
            Citizen.InvokeNative(0xFE99B66D079CF6BC, 0, 0x07CE1E61, true) -- disable attack
            Citizen.InvokeNative(0xFE99B66D079CF6BC, 0, 0xF84FA74F, true) -- disable aim
            Citizen.InvokeNative(0xFE99B66D079CF6BC, 0, 0xAC4BD4F1, true) -- disable weapon select
            Citizen.InvokeNative(0xFE99B66D079CF6BC, 0, 0x73846677, true) -- disable weapon
            Citizen.InvokeNative(0xFE99B66D079CF6BC, 0, 0x0AF99998, true) -- disable weapon
            Citizen.InvokeNative(0xFE99B66D079CF6BC, 0, 0xB2F377E8, true) -- disable melee
            Citizen.InvokeNative(0xFE99B66D079CF6BC, 0, 0xADEAF48C, true) -- disable melee

            if state.isNuiFocused() then
                DisableControlAction(0, 0xA987235F, true) --  MOUSE MOVE RIGHT
                DisableControlAction(0, 0xD2047988, true) -- MOUSE MOVE DOWN

                if not hasTarget or options and IsDisabledControlJustPressed(0, 0x53296B75) then
                    state.setNuiFocus(false, false)
                end
            elseif hasTarget and IsDisabledControlJustPressed(0, 0x07B8BEAF) then
                state.setNuiFocus(true, true)
            end

            if not toggleHotkey and IsControlJustReleased(0, targetHotkey) then
                stopTargeting()
                break
            end

            Wait(0)
        end

        SetStreamedTextureDictAsNoLongerNeeded(dict)
    end)

    while state.isActive() do
        if not state.isNuiFocused() and lib.progressActive() or LocalPlayer.state.invOpen or lib.getOpenContextMenu() or LocalPlayer.state.PlayerIsInCharacterShops or LocalPlayer.state.PlayerIsInTattooShop then
            state.setActive(false)
            break
        end

        local playerCoords = GetEntityCoords(cache.ped)
        hit, entityHit, endCoords = lib.raycast.fromCamera(flag, 4, 20)
        distance = #(playerCoords - endCoords)

        if entityHit ~= 0 and entityHit ~= lastEntity then
            local success, result = pcall(GetEntityType, entityHit)
            entityType = success and result or 0
        end

        if entityType == 0 then
            local _flag = flag == 30 and -1 or 30
            local _hit, _entityHit, _endCoords = lib.raycast.fromCamera(_flag, 4, 20)
            local _distance = #(playerCoords - _endCoords)

            if _distance < distance then
                flag, hit, entityHit, endCoords, distance = _flag, _hit, _entityHit, _endCoords, _distance

                if entityHit ~= 0 then
                    local success, result = pcall(GetEntityType, entityHit)
                    entityType = success and result or 0
                end
            end
        end

        nearbyZones, zonesChanged = utils.getNearbyZones(endCoords)

        local entityChanged = entityHit ~= lastEntity
        local newOptions = (zonesChanged or entityChanged or menuChanged) and true

        if entityHit > 0 and entityChanged then
            currentMenu = nil

            if flag ~= 30 then
                entityHit = HasEntityClearLosToEntity(entityHit, cache.ped, 7) and entityHit or 0
            end

            if lastEntity ~= entityHit and debug then
                if lastEntity then
                    Citizen.InvokeNative(0x76180407, lastEntity, false)
                end

                if entityType ~= 1 then
                    Citizen.InvokeNative(0x76180407, lastEntity, true)
                end
            end

            if entityHit > 0 then
                local success, result = pcall(GetEntityModel, entityHit)
                entityModel = success and result
            end
        end

        if hasTarget and (zonesChanged or entityChanged and hasTarget > 1) then
            SendNuiMessage('{"event": "leftTarget"}')

            if entityChanged then options:wipe() end

            if debug and lastEntity > 0 then SetEntityDrawOutline(lastEntity, false) end

            hasTarget = false
        end

        if newOptions and entityModel and entityHit > 0 then
            options:set(entityHit, entityType, entityModel)
        end

        lastEntity = entityHit
        currentTarget.entity = entityHit
        currentTarget.coords = endCoords
        currentTarget.distance = distance
        local hidden = 0
        local totalOptions = 0

        for k, v in pairs(options) do
            local optionCount = #v
            local dist = k == '__global' and 0 or distance
            totalOptions += optionCount

            for i = 1, optionCount do
                local option = v[i]
                local hide = shouldHide(option, dist, endCoords, entityHit, entityType, entityModel)

                if option.hide ~= hide then
                    option.hide = hide
                    newOptions = true
                end

                if hide then hidden += 1 end
            end
        end

        if zonesChanged then table.wipe(zones) end

        for i = 1, #nearbyZones do
            local zoneOptions = nearbyZones[i].options
            local optionCount = #zoneOptions
            totalOptions += optionCount
            zones[i] = zoneOptions

            for j = 1, optionCount do
                local option = zoneOptions[j]
                local hide = shouldHide(option, distance, endCoords, entityHit)

                if option.hide ~= hide then
                    option.hide = hide
                    newOptions = true
                end

                if hide then hidden += 1 end
            end
        end

        if newOptions then
            if hasTarget == 1 and options.size > 1 then
                hasTarget = true
            end

            if hasTarget and hidden == totalOptions then
                if hasTarget and hasTarget ~= 1 then
                    hasTarget = false
                    SendNuiMessage('{"event": "leftTarget"}')
                end
            elseif menuChanged or hasTarget ~= 1 and hidden ~= totalOptions then
                hasTarget = options.size

                if currentMenu and options.__global[1]?.name ~= 'builtin:goback' then
                    table.insert(options.__global, 1,
                        {
                            icon = 'fa-solid fa-circle-chevron-left',
                            label = locale('go_back'),
                            name = 'builtin:goback',
                            menuName = currentMenu,
                            openMenu = 'home'
                        })
                end

                SendNuiMessage(json.encode({
                    event = 'setTarget',
                    options = options,
                    zones = zones,
                }, { sort_keys = true }))
            end

            menuChanged = false
        end

        if isPauseMenuOrMapActive() then
            state.setActive(false)
            break
        end

        if not hasTarget or hasTarget == 1 then
            flag = flag == 30 and -1 or 30
        end

        Wait(hit and 50 or 100)
    end

    if lastEntity and debug then
        Citizen.InvokeNative(0x76180407, lastEntity, false)
    end

    state.setNuiFocus(false)
    SendNuiMessage('{"event": "visible", "state": false}')
    table.wipe(currentTarget)
    options:wipe()

    if nearbyZones then table.wipe(nearbyZones) end
end


local function isHashAvailable(hash)
    return hash ~= nil and hash ~= 0
end

local function addCustomKeybind(data)
    if isHashAvailable(data.hash) then
        lib.addKeybind({
            name = data.name,
            hash = data.hash,
            onPressed = data.onPressed
        })
    else
        CreateThread(function()
            while true do
                Wait(0)
                if IsControlJustPressed(0, data.defaultKey) then
                    data.onPressed()
                end
            end
        end)
    end
end

---@generic T
---@param option T
---@param server? boolean
---@return T
local function getResponse(option, server)
    local response = table.clone(option)
    response.entity = currentTarget.entity
    response.zone = currentTarget.zone
    response.coords = currentTarget.coords
    response.distance = currentTarget.distance

    if server then
        response.entity = response.entity ~= 0 and NetworkGetEntityIsNetworked(response.entity) and NetworkGetNetworkIdFromEntity(response.entity) or 0
    end

    response.icon = nil
    response.groups = nil
    response.items = nil
    response.canInteract = nil
    response.onSelect = nil
    response.export = nil
    response.event = nil
    response.serverEvent = nil
    response.command = nil

    return response
end

RegisterNUICallback('select', function(data, cb)
    cb(1)

    local zone = data[3] and nearbyZones[data[3]]

    ---@type OxTargetOption?
    local option = zone and zone.options[data[2]] or options[data[1]][data[2]]

    if option then
        if option.openMenu then
            local menuDepth = #menuHistory

            if option.name == 'builtin:goback' then
                option.menuName = option.openMenu
                option.openMenu = menuHistory[menuDepth]

                if menuDepth > 0 then
                    menuHistory[menuDepth] = nil
                end
            else
                menuHistory[menuDepth + 1] = currentMenu
            end

            menuChanged = true
            currentMenu = option.openMenu ~= 'home' and option.openMenu or nil

            options:wipe()
        else
            state.setNuiFocus(false)
        end

        currentTarget.zone = zone?.id

        if option.onSelect then
            option.onSelect(option.qtarget and currentTarget.entity or getResponse(option))
        elseif option.export then
            exports[option.resource][option.export](nil, getResponse(option))
        elseif option.event then
            TriggerEvent(option.event, getResponse(option))
        elseif option.serverEvent then
            TriggerServerEvent(option.serverEvent, getResponse(option, true))
        elseif option.command then
            ExecuteCommand(option.command)
        end

        if option.menuName == 'home' then return end
    end

    if not option?.openMenu and IsNuiFocused() then
        state.setActive(false)
    end
end)

RegisterNUICallback('appearanceReady', function(_, cb)
    waitForServerAppearance()
    cb({ success = true, settings = appearance })
end)

RegisterNUICallback('saveAppearance', function(data, cb)
    appearance = sanitizeAppearance(data)
    hasPersonalAppearance = true
    serverAppearanceLoaded = true
    SetResourceKvp(appearanceKvpKey, json.encode(appearance))
    SendNuiMessage(json.encode({ event = 'applyAppearance', settings = appearance }))
    cb({ success = true, settings = appearance })
end)

RegisterNUICallback('saveServerAppearance', function(data, cb)
    local settings = sanitizeAppearance(data)
    local success, result = pcall(lib.callback.await, 'ox_target:setServerAppearance', false, settings)

    if not success or type(result) ~= 'table' then
        cb({ success = false, error = 'server_error' })
        return
    end

    cb(result)
end)

RegisterNUICallback('getAppearanceAdminStatus', function(_, cb)
    cb({ success = true, isAdmin = isAppearanceAdmin() })
end)

RegisterNUICallback('closeAppearance', function(_, cb)
    closeAppearance(false)
    cb({ success = true })
end)

if appearanceCommand ~= '' then
    RegisterCommand(appearanceCommand, function()
        CreateThread(openAppearance)
    end, false)
end

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() and appearanceOpen then
        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)
    end
end)

CreateThread(function()
    while true do
        Wait(0)
        if IsControlJustPressed(0, targetHotkey) then
            if toggleHotkey and state.isActive() then
                stopTargeting()
            else
                startTargeting()
            end
        end
    end
end)
