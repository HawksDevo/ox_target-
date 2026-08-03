lib.checkDependency('ox_lib', '3.0.0', true)

---@type table<number, EntityInterface>
local entityStates = {}
local serverAppearanceKvpKey = 'ox_target:serverAppearance:v1'
local serverAppearance

do
    local stored = GetResourceKvpString(serverAppearanceKvpKey)

    if stored then
        local success, decoded = pcall(json.decode, stored)
        if success and type(decoded) == 'table' then serverAppearance = decoded end
    end
end

local function prepareServerAppearance(data)
    if type(data) ~= 'table' then return end

    local success, encoded = pcall(json.encode, data)
    if not success or type(encoded) ~= 'string' or #encoded > 32768 then return end

    success, data = pcall(json.decode, encoded)
    if not success or type(data) ~= 'table' then return end
    data.language = nil
    data.previewCount = nil
    data.previewSet = nil
    data.previewLabels = nil

    encoded = json.encode(data)
    return data, encoded
end

local function isAppearanceAdmin(source)
    if IsPlayerAceAllowed(tostring(source), 'ox_target.admin') then return true end
    for _, identifier in ipairs(GetPlayerIdentifiers(source)) do
        if IsPrincipalAceAllowed(('identifier.%s'):format(identifier), 'ox_target.admin') then
            return true
        end
    end
    return false
end

lib.callback.register('ox_target:getServerAppearance', function()
    return serverAppearance
end)

lib.callback.register('ox_target:isAppearanceAdmin', function(source)
    return isAppearanceAdmin(source)
end)

lib.callback.register('ox_target:setServerAppearance', function(source, data)
    if not isAppearanceAdmin(source) then
        return { success = false, error = 'not_allowed' }
    end

    local settings, encoded = prepareServerAppearance(data)
    if not settings then return { success = false, error = 'invalid_settings' } end

    serverAppearance = settings
    SetResourceKvp(serverAppearanceKvpKey, encoded)

    return { success = true }
end)

---@param netId number
RegisterNetEvent('ox_target:setEntityHasOptions', function(netId)
    local entity = Entity(NetworkGetEntityFromNetworkId(netId))
    entity.state.hasTargetOptions = true
    entityStates[netId] = entity
end)

CreateThread(function()
    local arr = {}
    local num = 0

    while true do
        Wait(10000)

        for netId, entity in pairs(entityStates) do
            if not DoesEntityExist(entity.__data) or not entity.state.hasTargetOptions then
                entityStates[netId] = nil
                num += 1

                arr[num] = netId
            end
        end

        if num > 0 then
            TriggerClientEvent('ox_target:removeEntity', -1, arr)
            table.wipe(arr)

            num = 0
        end
    end
end)
