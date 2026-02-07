import React from 'react'
import SettingsItem from '../SettingsItem/SettingsItem'
import { SETTINGS_PROPERTIES, SettingsWithValue, SettingValuesSet } from '../../../constants/settings'
import { SettingName } from '../../../constants/settings'

type Props = {
    settings: SettingsWithValue
    handleUpdate: (settingName: SettingName, newValues: SettingValuesSet) => void
}

export default function SettingsList({settings, handleUpdate}: Props) {

  return (
    <div>
        {Object.entries(settings).map(([name, values]) => {
            // TODO: write it better, on higher level
            const isDisabled =
                name === 'APPLES_TO_SPEED_UP_SNAKE' &&
                settings.SNAKE_SPEED_MULTIPLIER.relative === SETTINGS_PROPERTIES.SNAKE_SPEED_MULTIPLIER.offValue

            return (
                <SettingsItem
                    key={name}
                    name={name as SettingName}
                    values={values}
                    onUpdate={handleUpdate}
                    disabled={isDisabled}
                />
            )
        })}
    </div>
  )
}
